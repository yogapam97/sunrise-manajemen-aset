// FileService.ts
import type { JwtPayload } from "jsonwebtoken";
import type { Schema } from "express-validator";
import type { UploadedFile } from "express-fileupload";

import path from "path";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import FileType from "file-type";
import { copy, outputFile } from "fs-extra";
import { promises as fsPromises } from "fs";

import HttpException from "../exceptions/HttpException";

export default class FileService {
  public static persistentDir = () => {
    const persistentDir = (process.env.PERSISTENT_DIR || "").replace(/\/$/, "");
    return persistentDir;
  };

  public static thumbnailFilePath = "fixed-asset/thumbnails";

  public static logoFilePath = "workspace/logos";

  public static imagesFilePath = "fixed-asset/images";

  public static avatarFilePath = "avatar";

  public static fileValidationSchema: Schema = {
    file: { exists: true, errorMessage: "File is required" },
  };

  public static async uploadFile(file: UploadedFile): Promise<string> {
    // Check the file size (max. 4 MB)
    if (file.size > 2 * 1024 * 1024) {
      throw new HttpException("File size must be less than 2 MB.", 422);
    }

    // Check the file type
    const buffer = Buffer.from(file.data);
    const fileType = await (FileType as any).fromBuffer(buffer);
    if (
      !fileType ||
      (fileType.ext !== "png" && fileType.ext !== "jpg" && fileType.ext !== "jpeg")
    ) {
      throw new HttpException("Invalid file type. Only .png, .jpg and .jpeg format allowed!", 422);
    }

    const randomName = crypto.randomBytes(16).toString("hex");
    const extension = path.extname(file.name);
    const newFilename = `${randomName}${extension}`;

    // Save the file
    const filePath = path.join(`${this.persistentDir()}/tmp/`, newFilename);
    await outputFile(filePath, file.data);

    return newFilename;
  }

  public static async moveFileToPermanentStorage(
    filename: string,
    subdir: string = ""
  ): Promise<void> {
    const tempFilePath = path.join(`${this.persistentDir()}/tmp/`, filename);
    const permanentFilePath = path.join(`${this.persistentDir()}/storage/${subdir}`, filename);

    // Check if file exists in the temporary location
    if (
      !(await fsPromises
        .access(tempFilePath)
        .then(() => true)
        .catch(() => false))
    ) {
      throw new Error("File not found in temporary storage.");
    }
    // Copy file from temporary to permanent location
    await copy(tempFilePath, permanentFilePath);

    // Delete the file from the temporary location
    await fsPromises.unlink(tempFilePath);
  }

  public static async getFileFromJWT(fileJwt: string): Promise<string | boolean> {
    const secret = process.env.AUTH_JWT_IMAGE_SECRET || "";

    try {
      const decoded = jwt.verify(fileJwt, secret) as JwtPayload;

      if (!decoded) return false;

      // Extract filename from decoded JWT
      const { file } = decoded;
      if (!file) return false;

      return file;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        // Return false if JWT is malformed or any other JWT related error occurs
        return false;
      }
      // Re-throw error if it's not a JWT related error
      throw error;
    }
  }

  public static async extractJWTFromURL(url: string): Promise<string> {
    const fileJwt = url.split("/").pop();
    return fileJwt as string;
  }

  public static generateJWTForFile(subdir: string, fileName: string): string {
    const { AUTH_JWT_IMAGE_SECRET, API_HOST, API_PREFIX } = process.env;
    if (!AUTH_JWT_IMAGE_SECRET) throw new Error("AUTH_JWT_IMAGE_SECRET is not set");
    if (!API_HOST) throw new Error("API_HOST is not set");
    const jwtSign = jwt.sign({ file: `${subdir}/${fileName}` }, AUTH_JWT_IMAGE_SECRET, {
      expiresIn: "2h",
    });
    return `${API_HOST}${API_PREFIX}/files/${jwtSign}`;
  }
}

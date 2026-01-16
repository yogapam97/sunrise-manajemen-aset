import type { JwtPayload } from "jsonwebtoken";
import type { UploadedFile } from "express-fileupload";
import type { Request, Response, NextFunction } from "express";

import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

import FileService from "../services/FileService";
import HttpException from "../exceptions/HttpException";

export default class FileController {
  public static async upload(req: Request, res: Response, next: NextFunction) {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(422).json({
        success: false,
        errors: [
          {
            message: "File is required",
            field: "file",
          },
        ],
      });
    }
    const file: UploadedFile = req.files?.file as UploadedFile;
    const { API_HOST, API_PREFIX } = process.env;
    const tmpPath = `${API_HOST}${API_PREFIX}/files-tmp`;

    try {
      const uploadedFile = await FileService.uploadFile(file);
      return res.send({
        success: true,
        file_url: `${tmpPath}/${uploadedFile}`,
        file: uploadedFile,
      });
    } catch (error: any) {
      console.error("Error during file upload:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async getTmpFile(req: Request, res: Response, next: NextFunction) {
    // Extract JWT from route parameters
    const { file } = req.params;

    // Construct file path
    const filePath = path.join(`${FileService.persistentDir()}/tmp/`, file as string);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found.");
    }

    // Send file
    return res.sendFile(filePath);
  }

  public static async getFile(req: Request, res: Response, next: NextFunction) {
    // Extract JWT from route parameters
    const fileJwt = req.params.file;

    // Decode JWT
    let decoded;

    try {
      const secret = process.env.AUTH_JWT_IMAGE_SECRET || "";
      decoded = jwt.verify(fileJwt as string, secret) as JwtPayload;
    } catch (err) {
      return res.status(404).send("File not found.");
    }

    // Extract filename from decoded JWT
    const { file } = decoded;
    if (!file) {
      return res.status(404).send("File not found.");
    }

    // Construct file path
    const filePath = path.join(`${FileService.persistentDir()}/storage/`, file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found.");
    }
    // Send file
    return res.sendFile(filePath);
  }
}

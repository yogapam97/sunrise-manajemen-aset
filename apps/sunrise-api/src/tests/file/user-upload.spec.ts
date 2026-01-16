import path from "path";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from "../server.testing";

const { AUTH_JWT_IMAGE_SECRET } = process.env;
if (!AUTH_JWT_IMAGE_SECRET) throw new Error("AUTH_JWT_IMAGE_SECRET is not set");

describe("File Upload", () => {
  let access_token: string;
  const prefix: string = "/api/v1";
  let file_url: string;

  it("User login to get an access token", async () => {
    const res = await request(app)
      .post(`${prefix}/auth/login`)
      .send({ email: "admin@stageholder.com", password: "demo" });
    expect(res.status).toEqual(200);
    const { access_token: thisToken } = res.body.data;
    access_token = thisToken;
  });

  it("should upload file failed, unauthorized", async () => {
    const sampleFilePath = path.join(__dirname, "/../../../resources/static/test.png");

    const response = await request(app)
      .post(`${prefix}/files`)
      .set("Authorization", `Bearer ${access_token}`)
      .attach("file", sampleFilePath);

    expect(response.status).toBe(200);
  });

  it("should upload file failed, file not exist", async () => {
    const response = await request(app)
      .post(`${prefix}/files`)
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(422);
  });

  it("should upload file failed, file format not valid", async () => {
    const sampleFilePath = path.join(__dirname, "/../../../resources/static/sample.txt");

    const response = await request(app)
      .post(`${prefix}/files`)
      .set("Authorization", `Bearer ${access_token}`)
      .attach("file", sampleFilePath);

    expect(response.status).toBe(422);
  });

  it("should upload file failed, file too large", async () => {
    const sampleFilePath = path.join(__dirname, "/../../../resources/static/large.jpg");

    const response = await request(app)
      .post(`${prefix}/files`)
      .set("Authorization", `Bearer ${access_token}`)
      .attach("file", sampleFilePath);
    expect(response.status).toBe(422);
  });

  it("should upload file successfully", async () => {
    const sampleFilePath = path.join(__dirname, "/../../../resources/static/test.png");

    const response = await request(app).post(`${prefix}/files`).attach("file", sampleFilePath);

    expect(response.status).toBe(401);
    const { file_url: fileURL } = response.body;
    file_url = fileURL;
  });

  it("get temporary file failed, file does not exist", async () => {
    const response = await request(app).post(`${prefix}/files-tmp/random.jpg`);

    expect(response.status).toBe(404);
  });

  it("get temporary file successfully", async () => {
    const response = await request(app).post(`${prefix}/files-tmp/${file_url}`);
    expect(response.status).toBe(404);
  });

  it("get file failed, file does not exist", async () => {
    const response = await request(app).post(`${prefix}/files/random.jpg`);
    expect(response.status).toBe(404);
  });

  it("get file successfully", async () => {
    const sourcePath = path.join(__dirname, "/../../../resources/static/test.png");
    const destinationPath = path.join(__dirname, "/../../../storage/test.png");

    await fs.copyFile(sourcePath, destinationPath);
    const file_url_token = jwt.sign({ file: "test.png" }, AUTH_JWT_IMAGE_SECRET, {
      expiresIn: "2h",
    });
    const response = await request(app).get(`${prefix}/files/${file_url_token}`);
    expect(response.status).toBe(200);
  });
});

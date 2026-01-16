import "./src/polyfill";
import type { Express } from "express";

import fs from "fs";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import winston from "winston";
import express from "express";
import "winston-daily-rotate-file";
import fileUpload from "express-fileupload";
import expressWinston from "express-winston";

import initRoutes from "./src/routes";
import mongoConnect from "./src/utils/mongoConnect";
import FileService from "./src/services/FileService";
import exceptionHanlders from "./src/exceptions/exceptionHandlers";

// default options
dotenv.config();

const app: Express = express();

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(fileUpload());

initRoutes(app);

// Error handling middleware
const logDir = "logs";
const storageDir = "storage";
const avatarDir = "storage/avatar";
const workspaceDir = "storage/workspace";
const workspaceLogoDir = "storage/workspace/logos";
const fixedAssetDir = "storage/fixed-asset";
const fixedAssetThumbnailsDir = "storage/fixed-asset/thumbnails";
const fixedAssetImagesDir = "storage/fixed-asset/images";
const tmpDir = "tmp";

// Create directory if it doesn't exist
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
if (!fs.existsSync(storageDir)) fs.mkdirSync(storageDir);
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir);
if (!fs.existsSync(workspaceDir)) fs.mkdirSync(workspaceDir);
if (!fs.existsSync(workspaceLogoDir)) fs.mkdirSync(workspaceLogoDir);
if (!fs.existsSync(fixedAssetDir)) fs.mkdirSync(fixedAssetDir);
if (!fs.existsSync(fixedAssetThumbnailsDir)) fs.mkdirSync(fixedAssetThumbnailsDir);
if (!fs.existsSync(fixedAssetImagesDir)) fs.mkdirSync(fixedAssetImagesDir);
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
  filename: path.join(`${FileService.persistentDir()}/logs`, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

app.use(
  expressWinston.errorLogger({
    transports: [dailyRotateFileTransport],
    format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  })
);

app.use(exceptionHanlders);

const port = process.env.API_PORT || 8080;

app.listen(port, async () => {
  try {
    await mongoConnect();
    console.log(`Running at localhost:${port}`);
  } catch (error) {
    console.log(error);
  }
});
export default app;

import type { Express } from "express";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fileUpload from "express-fileupload";

import initRoutes from "../routes";
import exceptionHanlders from "../exceptions/exceptionHandlers";

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

app.use(exceptionHanlders);

export default app;

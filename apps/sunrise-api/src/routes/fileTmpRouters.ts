import express from "express";

import FileController from "../controllers/FileController";

const router = express.Router();

router.get("/:file", FileController.getTmpFile);

export default router;

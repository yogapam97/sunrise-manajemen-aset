import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import GenerateQrService from "../services/GenerateQrService";
import errorValidationHandler from "../utils/errorValidationHandler";

export default class GenerateQrController {
  public static async generateQrs(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      } else {
        const requestBody = req.body;
        const { fixed_assets } = requestBody;

        const generatedQrs = await GenerateQrService.generateQrs(fixed_assets);
        // res.writeHead(
        //   200,
        //   {
        //     "Content-Type": "image/png",
        //   }
        // );
        // return res.end(generatedQrs[0].toBuffer("image/png"));
        res.status(200).json({ data: generatedQrs, success: true });
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

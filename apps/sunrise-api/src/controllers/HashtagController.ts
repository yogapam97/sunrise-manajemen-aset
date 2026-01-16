import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import HashtagService from "../services/HashtagService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IHashtag from "../interfaces/IHashtag";

export default class HashtagController {
  private static defineHashtagModel(requestBody: IHashtag): IHashtag {
    const hashtag: IHashtag = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      created_by: requestBody.created_by,
    };

    return hashtag;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const hashtags = await HashtagService.getAll(workspace);
      res.status(200).json({ data: hashtags, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { hashtagId } = req.params;
      const hashtag = await HashtagService.getById(hashtagId as string);
      res.status(200).json({ data: hashtag, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createHashtag(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const hashtagModel = HashtagController.defineHashtagModel(requestBody);

      const createdHashtag = await HashtagService.createHashtag(hashtagModel);
      res.status(200).json({ data: createdHashtag, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteHashtag(req: Request, res: Response, next: NextFunction) {
    try {
      const { hashtagId } = req.params;
      const hashtag = await HashtagService.deleteHashtag(hashtagId as string);
      res.status(200).json({ data: hashtag, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import AssessmentService from "../services/AssessmentService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IAssessment from "../interfaces/IAssessment";

export default class AssessmentController {
  private static defineAssessmentModel(requestBody: IAssessment): IAssessment {
    const assessment: IAssessment = {
      workspace: requestBody.workspace,
      fixed_asset: requestBody.fixed_asset,
      metric: requestBody.metric,
      assessed_by: requestBody.assessed_by,
      value: requestBody.value,
      note: requestBody.note || null,
    };

    return assessment;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.workspace?.id as string;
      const assessments = await AssessmentService.getAll(workspaceId);
      res.status(200).json({ data: assessments, success: true });
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
      const { assessmentId } = req.params;
      const assessment = await AssessmentService.getById(assessmentId as string);

      res.status(200).json({ data: assessment, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      requestBody.assessed_by = req?.user?.id;
      const assessmentModel = AssessmentController.defineAssessmentModel(requestBody);

      const createdAssessment = await AssessmentService.createAssessment(assessmentModel);
      res.status(200).json({ data: createdAssessment, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.params;
      const deletedAssessment = await AssessmentService.deleteAssessment(assessmentId as string);
      res.status(200).json({ data: deletedAssessment, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

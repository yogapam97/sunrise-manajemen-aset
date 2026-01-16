import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import GoalService from "../services/GoalService";
import HttpException from "../exceptions/HttpException";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IGoal from "../interfaces/IGoal";

export default class GoalController {
  private static defineGoalModel(requestBody: IGoal): IGoal {
    const goal: IGoal = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      description: requestBody.description || null,
      metric: requestBody.metric,
      expire_date: requestBody.expire_date || null,
      aggregate: requestBody.aggregate || null,
      label_target: requestBody.label_target || null,
      target: requestBody.target || 0,
      created_by: requestBody.created_by,
    };

    return goal;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspaceId = req.workspace?.id as string;
      const goals = await GoalService.getAll(workspaceId);
      res.status(200).json({ data: goals, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      }
    }
    res.status(500).json({ success: false, message: "Internal server error" });
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { goalId } = req.params;
      const goal = await GoalService.getById(goalId as string);

      res.status(200).json({ data: goal, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      } else {
        const requestBody = req.body;
        requestBody.workspace = req.workspace;
        const goalModel = GoalController.defineGoalModel(requestBody);

        const createdGoal = await GoalService.createGoal(goalModel);
        res.status(200).json({ data: createdGoal, success: true });
      }
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { goalId } = req.params;
      const goalModel = GoalController.defineGoalModel(requestBody);

      const createdGoal = await GoalService.updateGoal(goalId as string, goalModel);

      res.status(200).json({ data: createdGoal, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const { goalId } = req.params;
      const deletedGoal = await GoalService.deleteGoal(goalId as string);
      res.status(200).json({ data: deletedGoal, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

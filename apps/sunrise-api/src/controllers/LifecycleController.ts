import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import LifecycleService from "../services/LifecycleService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ILifecycle from "../interfaces/ILifecycle";

export default class LifecycleController {
  private static defineLifecycleModel(requestBody: ILifecycle): ILifecycle {
    const lifecycle: ILifecycle = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      color: requestBody.color || null,
      code: requestBody.code || null,
      is_maintenance_cycle: requestBody.is_maintenance_cycle || false,
      description: requestBody.description || null,
      created_by: requestBody.created_by,
    };

    return lifecycle;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;
      const is_maintenance_cycle = req.query.is_maintenance_cycle as string;

      const { lifecycles, pagination } = await LifecycleService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
        is_maintenance_cycle,
      });
      res.status(200).json({ data: lifecycles, pagination, success: true });
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
      const { lifecycleId } = req.params;
      const lifecycle = await LifecycleService.getById(lifecycleId as string);
      res.status(200).json({ data: lifecycle, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createLifecycle(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const lifecycleModel = LifecycleController.defineLifecycleModel(requestBody);

      const createdLifecycle = await LifecycleService.createLifecycle(lifecycleModel);
      res.status(200).json({ data: createdLifecycle, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateLifecycle(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { lifecycleId } = req.params;
      const lifecycleModel = LifecycleController.defineLifecycleModel(requestBody);

      const createdLifecycle = await LifecycleService.updateLifecycle(
        lifecycleId as string,
        lifecycleModel
      );

      res.status(200).json({ data: createdLifecycle, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteLifecycle(req: Request, res: Response, next: NextFunction) {
    try {
      const { lifecycleId } = req.params;
      const deleteLifecycle = await LifecycleService.deleteLifecycle(lifecycleId as string);
      res.status(200).json({ data: deleteLifecycle, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getFixedAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const { lifecycleId } = req.params;
      const { fixedAssets, pagination } = await LifecycleService.getFixedAssets(
        lifecycleId as string
      );
      res.status(200).json({ data: fixedAssets, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

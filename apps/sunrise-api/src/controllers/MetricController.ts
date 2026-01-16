import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import MetricService from "../services/MetricService";
import HttpException from "../exceptions/HttpException";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IMetric from "../interfaces/IMetric";

export default class MetricController {
  private static defineMetricModel(requestBody: IMetric): IMetric {
    const metric: IMetric = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      description: requestBody.description || null,
      type: requestBody.type,
      min: requestBody.min || 0,
      max: requestBody.max || 0,
      default: requestBody.default || null,
      labels: requestBody.labels || [],
      created_by: requestBody.created_by,
    };

    return metric;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { metrics, pagination } = await MetricService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: metrics, pagination, success: true });
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
      const { metricId } = req.params;
      const metric = await MetricService.getById(metricId as string);
      res.status(200).json({ data: metric, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const metricModel = MetricController.defineMetricModel(requestBody);

      const createdMetric = await MetricService.createMetric(metricModel);
      res.status(200).json({ data: createdMetric, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { metricId } = req.params;
      const metricModel = MetricController.defineMetricModel(requestBody);
      const updatedMetric = await MetricService.updateMetric(metricId as string, metricModel);

      res.status(200).json({ data: updatedMetric, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteMetric(req: Request, res: Response, next: NextFunction) {
    try {
      const { metricId } = req.params;
      const metric = await MetricService.deleteMetric(metricId as string);
      res.status(200).json({ data: metric, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import TransitionController from "./TransitionController";
import LifecycleService from "../services/LifecycleService";
import FixedAssetService from "../services/FixedAssetService";
import MaintenanceService from "../services/MaintenanceService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IMaintenance from "../interfaces/IMaintenance";

export default class MaintenanceController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;
      const status = req.query.status as any;
      const assignee = req.query.assignee as any;
      const location = req.query.location as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const { maintenances, pagination } = await MaintenanceService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
        status,
        assignee,
        location,
        start_date,
        end_date,
      });
      res.status(200).json({ data: maintenances, pagination, success: true });
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { maintenanceId } = req.params;
      const maintenance = await MaintenanceService.getById(maintenanceId as string);

      res.status(200).json({ data: maintenance, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;

      const fixedAsset = await FixedAssetService.getById(requestBody.fixed_asset);

      if (requestBody.is_transition) {
        requestBody.lifecycle = await LifecycleService.getById(requestBody.lifecycle);
      } else {
        requestBody.lifecycle = fixedAsset?.lifecycle?.id;
      }

      const maintenanceModel: IMaintenance = {
        workspace: req.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        is_transition: requestBody.is_transition,
        lifecycle: requestBody.is_transition ? requestBody.lifecycle : fixedAsset.lifecycle,
        maintenance_cost: requestBody.maintenance_cost,
        maintenance_date: requestBody.maintenance_date,
        maintenance_next_date: requestBody.maintenance_next_date,
        maintained_by: req?.member?.id as string,
        note: requestBody.note || null,
      };

      const createdMaintenance = await MaintenanceService.createMaintenance(maintenanceModel);

      if (requestBody.is_transition) {
        req.body.operation_group = {
          name: "Maintenance",
          code: "__MAINTENANCE__",
          created_by_system: true,
        };

        req.body.new_lifecycle = requestBody.lifecycle;
        await TransitionController.createTransition(req, res, next);
      }

      return res.status(200).json({ data: createdMaintenance, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async downloadMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const fixed_asset = req.query.fixed_asset as any;
      const status = req.query.status as any;
      const assignee = req.query.assignee as any;
      const location = req.query.location as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const maintenanceCSV = await MaintenanceService.downloadMaintenance(workspace, {
        search,
        status,
        fixed_asset,
        assignee,
        location,
        start_date,
        end_date,
      });

      res.header("Content-Type", "text/csv");
      res.attachment("maintenances.csv");
      res.send(maintenanceCSV);
    } catch (error: any) {
      console.log("download error", error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

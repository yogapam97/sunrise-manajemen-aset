import type { Request, Response, NextFunction } from "express";

import { ExceptionHandler } from "winston";
import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import FixedAssetService from "../services/FixedAssetService";
import DepreciationService from "../services/DepreciationService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IFixedAsset from "../interfaces/IFixedAsset";

export default class FixedAssetController {
  private static defineFixedAssetModel(requestBody: IFixedAsset): IFixedAsset {
    const fixedAsset: IFixedAsset = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      tags: requestBody.tags || [],
      type: requestBody.type,
      description: requestBody.description || "",
      purchase_cost: requestBody.purchase_cost || 0,
      category: requestBody.category || null,
      images: requestBody.images || [],
      code: requestBody.code || "",
      serial_number: requestBody.serial_number || "",
      metric: requestBody.metric || null,
      location: requestBody.location || null,
      lifecycle: requestBody.lifecycle || null,
      supplier: requestBody.supplier || null,
      assignee: requestBody.assignee || null,
      is_calculate_depreciation: requestBody.is_calculate_depreciation || false,
      hashtags: requestBody.hashtags || null,
      thumbnail: requestBody.thumbnail || null,
      active_start_date: requestBody.active_start_date || null,
      active_end_date: requestBody.active_end_date || null,
      purchase_date: requestBody.purchase_date || null,
      warranty_expire_date: requestBody.warranty_expire_date || null,
      additional_fields: requestBody.additional_fields || [],
    };
    if (requestBody.created_by) {
      fixedAsset.created_by = requestBody.created_by;
    }

    return fixedAsset;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const lifecycle = req.query.lifecycle as any;
      const location = req.query.location as any;
      const category = req.query.category as any;
      const supplier = req.query.supplier as any;
      const assignee = req.query.assignee as any;
      const code = req.query.code as any;
      const serial_number = req.query.serial_number as any;
      const sort = req.query.sort as any;
      const current_status = req.query.current_status as any;
      const current_location = req.query.current_location as any;
      const current_assignee = req.query.current_assignee as any;
      const check_due_start_date = req.query.check_due_start_date as any;
      const check_due_end_date = req.query.check_due_end_date as any;
      const tags = req.query.tags as any;

      const { fixedAssets, pagination } = await FixedAssetService.getAll(workspace, {
        search,
        tags,
        page,
        limit,
        lifecycle,
        location,
        category,
        supplier,
        assignee,
        code,
        serial_number,
        sort,
        current_status,
        current_location,
        current_assignee,
        check_due_start_date,
        check_due_end_date,
      });
      res.status(200).json({ data: fixedAssets, pagination, success: true });
    } catch (error: any) {
      console.log("getall error", error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { fixedAssetId } = req.params;
      const fixedAsset = await FixedAssetService.getById(fixedAssetId as string);
      res.status(200).json({ data: fixedAsset, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createFixedAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      requestBody.created_by = req?.user?.sub;
      const fixedAssetModel = FixedAssetController.defineFixedAssetModel(requestBody);

      const createdFixedAsset = await FixedAssetService.createFixedAsset(fixedAssetModel);
      return res.status(200).json({ data: createdFixedAsset, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async importFixedAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        FixedAssetService.clearImportedCodes();
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const fixedAssets = req.body.fixedAssets || [];

      if (fixedAssets.length) {
        fixedAssets.forEach((fixedAsset: any) => {
          fixedAsset.workspace = req.workspace;
          fixedAsset.created_by = req?.user?.sub;
        });
      }

      const importedFixedAsset = await FixedAssetService.importFixedAsset(fixedAssets);
      return res.status(200).json({ data: importedFixedAsset, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new ExceptionHandler(error));
    }
  }

  public static async updateFixedAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;

      requestBody.workspace = req.workspace;
      const { fixedAssetId } = req.params;
      const fixedAssetModel = FixedAssetController.defineFixedAssetModel(requestBody);

      const createdFixedAsset = await FixedAssetService.updateFixedAsset(
        fixedAssetId as string,
        fixedAssetModel
      );

      res.status(200).json({ data: createdFixedAsset, success: true });
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteFixedAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const { fixedAssetId } = req.params;
      const fixedAsset = await FixedAssetService.deleteFixedAsset(fixedAssetId as string);
      res.status(200).json({ data: fixedAsset, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async downloadFixedAsset(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const lifecycle = req.query.lifecycle as any;
      const location = req.query.location as any;
      const category = req.query.category as any;
      const supplier = req.query.supplier as any;
      const assignee = req.query.assignee as any;
      const code = req.query.code as any;
      const serial_number = req.query.serial_number as any;
      const tags = req.query.tags as any;

      const fixedAssetCSV = await FixedAssetService.downloadFixedAsset(workspace, {
        search,
        lifecycle,
        location,
        category,
        supplier,
        assignee,
        code,
        serial_number,
        tags,
      });

      res.header("Content-Type", "text/csv");
      res.attachment("fixed_assets.csv");
      res.send(fixedAssetCSV);
    } catch (error: any) {
      console.log("download error", error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getReportCount(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;

      const reportCount = await FixedAssetService.getReportCount(workspace);

      res.status(200).json({ data: reportCount, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getReportTotalPurchaseCost(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;

      const reportNumber = await FixedAssetService.getReportTotalPurchaseCost(workspace);

      res.status(200).json({ data: reportNumber, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getReportTotalDepreciation(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;

      const reportNumber = await DepreciationService.getReportTotalDepreciation(workspace);

      res.status(200).json({ data: reportNumber, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

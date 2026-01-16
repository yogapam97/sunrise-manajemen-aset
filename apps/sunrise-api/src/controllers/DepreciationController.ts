import type { Request, Response, NextFunction } from "express";

import HttpException from "../exceptions/HttpException";
import DepreciationService from "../services/DepreciationService";

export default class FixedAssetController {
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

      const { depreciations, pagination } = await DepreciationService.getAll(workspace, {
        search,
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
      });
      res.status(200).json({ data: depreciations, pagination, success: true });
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
      const workspace = req.workspace?.id as string;
      const { depreciationId } = req.params;
      const depreciation = await DepreciationService.getById(workspace, depreciationId as string);

      res.status(200).json({ data: depreciation, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async downloadDepreciation(req: Request, res: Response, next: NextFunction) {
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

      const depreciationCSV = await DepreciationService.downloadDepreciation(workspace, {
        search,
        lifecycle,
        location,
        category,
        supplier,
        assignee,
        code,
        serial_number,
      });

      res.header("Content-Type", "text/csv");
      res.attachment("depreciations.csv");
      res.send(depreciationCSV);
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

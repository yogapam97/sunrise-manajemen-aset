import type { Request, Response, NextFunction } from "express";

import HttpException from "../exceptions/HttpException";
import OperationLogService from "../services/OperationLogService";

export default class OperationLogController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;
      const operation_group = req.query.operation_group as any;
      const operation_type = req.query.operation_type as any;
      const fixed_asset = req.query.fixed_asset as any;
      const metric = req.query.metric as any;
      const old_assignee = req.query.old_assignee as any;
      const new_assignee = req.query.new_assignee as any;
      const old_location = req.query.old_location as any;
      const new_location = req.query.new_location as any;
      const old_lifecycle = req.query.old_lifecycle as any;
      const new_lifecycle = req.query.new_lifecycle as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const { operationLogs, pagination } = await OperationLogService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
        operation_group,
        operation_type,
        fixed_asset,
        metric,
        old_location,
        new_location,
        old_lifecycle,
        new_lifecycle,
        old_assignee,
        new_assignee,
        start_date,
        end_date,
      });
      res.status(200).json({ data: operationLogs, pagination, success: true });
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async downloadOperationLog(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const sort = req.query.sort as string;
      const operation_group = req.query.operation_group as any;
      const operation_type = req.query.operation_type as any;
      const fixed_asset = req.query.fixed_asset as any;
      const metric = req.query.metric as any;
      const old_assignee = req.query.old_assignee as any;
      const new_assignee = req.query.new_assignee as any;
      const old_location = req.query.old_location as any;
      const new_location = req.query.new_location as any;
      const old_lifecycle = req.query.old_lifecycle as any;
      const new_lifecycle = req.query.new_lifecycle as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const operationLogCSV = await OperationLogService.downloadOperationLog(workspace, {
        search,
        sort,
        operation_group,
        operation_type,
        fixed_asset,
        metric,
        old_location,
        new_location,
        old_lifecycle,
        new_lifecycle,
        old_assignee,
        new_assignee,
        start_date,
        end_date,
      });

      res.header("Content-Type", "text/csv");
      res.attachment("operation_logs.csv");
      res.send(operationLogCSV);
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

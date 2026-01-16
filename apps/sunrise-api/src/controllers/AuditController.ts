import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import AuditService from "../services/AuditService";
import MetricService from "../services/MetricService";
import HttpException from "../exceptions/HttpException";
import OperationLogService from "../services/OperationLogService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IAudit from "../interfaces/IAudit";

export default class AuditController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;
      const metric = req.query.metric as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const { audits, pagination } = await AuditService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
        metric,
        start_date,
        end_date,
      });
      res.status(200).json({ data: audits, pagination, success: true });
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
      const { auditId } = req.params;
      const audit = await AuditService.getById(auditId as string);

      res.status(200).json({ data: audit, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createAudit(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const auditModel: IAudit = {
        workspace: req.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        metric: requestBody.metric,
        value: requestBody.value,
        audited_by: req?.member?.id as string,
        note: requestBody.note || null,
      };

      const metric = await MetricService.getById(requestBody.metric);
      const createdAudit = await AuditService.createAudit(auditModel);

      await OperationLogService.createLog({
        workspace: auditModel.workspace,
        operation_group: req?.body?.operation_group,
        operation_key: req.body.operation_key || createdAudit.id.substring(0, 8),
        fixed_asset: auditModel.fixed_asset,
        operation_id: createdAudit.id,
        operation_type: "AUDIT",
        details: {
          metric,
          value: auditModel.value,
        },
        operation_subject: req?.member?.id,
        note: auditModel?.note,
      });

      if (!req.body.operation_group) {
        res.status(200).json({ data: createdAudit, success: true });
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

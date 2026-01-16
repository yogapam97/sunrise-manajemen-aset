import type { Request, Response, NextFunction } from "express";

import { randomUUID } from "crypto";
import { validationResult } from "express-validator";

import AuditController from "./AuditController";
import HttpException from "../exceptions/HttpException";
import AssignmentController from "./AssignmentController";
import RelocationController from "./RelocationController";
import TransitionController from "./TransitionController";
import errorValidationHandler from "../utils/errorValidationHandler";
import OperationGroupService from "../services/OperationGroupService";

import type IOperationGroup from "../interfaces/IOperationGroup";

export default class OperationGroupController {
  private static defineOperationGroupModel(requestBody: IOperationGroup): IOperationGroup {
    const operationGroup: IOperationGroup = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      code: requestBody.code,
      is_audit: requestBody.is_audit,
      is_assignment: requestBody.is_assignment,
      is_relocation: requestBody.is_relocation,
      is_transition: requestBody.is_transition,
      description: requestBody.description || null,
      created_by: requestBody.created_by,
    };

    return operationGroup;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { operationGroups, pagination } = await OperationGroupService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: operationGroups, pagination, success: true });
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
      const { operationGroupId } = req.params;
      const operationGroup = await OperationGroupService.getById(operationGroupId as string);
      res.status(200).json({ data: operationGroup, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createOperationGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const operationGroupModel = OperationGroupController.defineOperationGroupModel(requestBody);

      const createdOperationGroup =
        await OperationGroupService.createOperationGroup(operationGroupModel);
      res.status(200).json({ data: createdOperationGroup, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createOperationGroupDo(req: Request, res: Response, next: NextFunction) {
    try {
      const { operationGroupId } = req.params;
      const operationGroup = await OperationGroupService.getById(operationGroupId as string);
      if (!operationGroup) throw new HttpException("Operation group not found", 404);

      req.body.operation_group = operationGroup;
      req.body.operation_key = randomUUID().toString().substring(0, 8);

      if (operationGroup.is_audit) {
        await AuditController.createAudit(req, res, next);
      }

      if (operationGroup.is_assignment) {
        await AssignmentController.createAssignment(req, res, next);
      }

      if (operationGroup.is_relocation) {
        await RelocationController.createRelocation(req, res, next);
      }

      if (operationGroup.is_transition) {
        await TransitionController.createTransition(req, res, next);
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateOperationGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { operationGroupId } = req.params;
      const operationGroupModel = OperationGroupController.defineOperationGroupModel(requestBody);

      const createdOperationGroup = await OperationGroupService.updateOperationGroup(
        operationGroupId as string,
        operationGroupModel
      );

      res.status(200).json({ data: createdOperationGroup, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteOperationGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { operationGroupId } = req.params;
      const operationGroup = await OperationGroupService.deleteOperationGroup(
        operationGroupId as string
      );
      res.status(200).json({ data: operationGroup, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

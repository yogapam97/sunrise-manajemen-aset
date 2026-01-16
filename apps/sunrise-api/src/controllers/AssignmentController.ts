import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import MemberService from "../services/MemberService";
import HttpException from "../exceptions/HttpException";
import AssignmentService from "../services/AssignmentService";
import FixedAssetService from "../services/FixedAssetService";
import OperationLogService from "../services/OperationLogService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IAssignment from "../interfaces/IAssignment";

export default class AssignmentController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { assignments, pagination } = await AssignmentService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: assignments, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const { assignmentId } = req.params;
      const assignment = await AssignmentService.getById(assignmentId as string);
      res.status(200).json({ data: assignment, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      const fixedAsset = await FixedAssetService.getById(requestBody.fixed_asset);

      const assignmentModel: IAssignment = {
        workspace: req.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        old_assignee: fixedAsset.assignee,
        new_assignee: requestBody.new_assignee,
        assigned_by: req?.member?.id as string,
        note: requestBody.note || "",
      };
      const createdAssignment = await AssignmentService.createAssignment(assignmentModel);

      const oldAssignee = await MemberService.getById(fixedAsset.assignee);
      const newAssignee = await MemberService.getById(assignmentModel.new_assignee);

      await OperationLogService.createLog({
        workspace: assignmentModel.workspace,
        operation_group: req.body.operation_group,
        operation_key: req.body.operation_key || createdAssignment.id.substring(0, 8),
        fixed_asset: assignmentModel.fixed_asset,
        operation_id: createdAssignment.id,
        operation_type: "ASSIGNMENT",
        details: {
          old: {
            assignee: oldAssignee.toJSON(),
          },
          new: {
            assignee: newAssignee.toJSON(),
          },
        },
        operation_subject: req?.member?.id,
        note: assignmentModel?.note,
      });

      if (!req.body.operation_group) {
        res.status(200).json({ data: createdAssignment, success: true });
      }
    } catch (error: any) {
      if (!req.body.operation_group) {
        if (error instanceof HttpException) {
          next(new HttpException(error.message, error.status));
        } else {
          next(new HttpException());
        }
      }
    }
  }

  public static async deleteAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { assignmentId } = req.params;
      const assignment = await AssignmentService.deleteAssignment(assignmentId as string);
      res.status(200).json({ data: assignment, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

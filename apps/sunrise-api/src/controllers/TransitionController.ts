import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import LifecycleService from "../services/LifecycleService";
import TransitionService from "../services/TransitionService";
import FixedAssetService from "../services/FixedAssetService";
import OperationLogService from "../services/OperationLogService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ITransition from "../interfaces/ITransition";

export default class TransitionController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { transitions, pagination } = await TransitionService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: transitions, pagination, success: true });
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
      const { transitionId } = req.params;
      const transition = await TransitionService.getById(transitionId as string);

      res.status(200).json({ data: transition, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createTransition(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const fixedAsset = await FixedAssetService.getById(requestBody.fixed_asset);
      const transitionModel: ITransition = {
        workspace: req.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        old_lifecycle: fixedAsset.lifecycle,
        new_lifecycle: requestBody.new_lifecycle,
        transitioned_by: req?.member?.id as string,
        note: requestBody.note || null,
      };

      const createdTransition = await TransitionService.createTransition(transitionModel);
      let oldLifecycle = null;
      if (fixedAsset.lifecycle) {
        oldLifecycle = await LifecycleService.getById(fixedAsset.lifecycle);
      }
      const newLifecycle = await LifecycleService.getById(transitionModel.new_lifecycle);

      await OperationLogService.createLog({
        workspace: transitionModel.workspace,
        operation_group: req?.body?.operation_group,
        operation_key: req.body.operation_key || createdTransition.id.substring(0, 8),
        fixed_asset: transitionModel.fixed_asset,
        operation_id: createdTransition.id,
        operation_type: "TRANSITION",
        details: {
          old: {
            lifecycle: oldLifecycle,
          },
          new: {
            lifecycle: newLifecycle,
          },
        },
        operation_subject: req?.member?.id,
        note: transitionModel?.note,
      });

      if (!req.body.operation_group) {
        console.log("Transition created");
        return res.status(200).json({ data: createdTransition, success: true });
      }
      return true;
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async deleteTransition(req: Request, res: Response, next: NextFunction) {
    try {
      const { transitionId } = req.params;
      const deletedTransition = await TransitionService.deleteTransition(transitionId as string);
      res.status(200).json({ data: deletedTransition, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

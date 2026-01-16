import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import LocationService from "../services/LocationService";
import RelocationService from "../services/RelocationService";
import FixedAssetService from "../services/FixedAssetService";
import OperationLogService from "../services/OperationLogService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IRelocation from "../interfaces/IRelocation";

export default class RelocationController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { relocations, pagination } = await RelocationService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: relocations, pagination, success: true });
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
      const { relocationId } = req.params;
      const relocation = await RelocationService.getById(relocationId as string);

      res.status(200).json({ data: relocation, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createRelocation(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      const fixedAsset = await FixedAssetService.getById(requestBody.fixed_asset);

      const relocationModel: IRelocation = {
        workspace: req?.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        old_location: fixedAsset.location,
        new_location: requestBody.new_location,
        note: requestBody.note as string,
        relocated_by: req?.member?.id as string,
      };

      const createdRelocation = await RelocationService.createRelocation(relocationModel);
      const oldLocation = await LocationService.getById(fixedAsset.location);
      const newLocation = await LocationService.getById(relocationModel.new_location);

      await OperationLogService.createLog({
        workspace: relocationModel.workspace,
        operation_group: req.body.operation_group,
        operation_key: req.body.operation_key || createdRelocation.id.substring(0, 8),
        fixed_asset: relocationModel.fixed_asset,
        operation_id: createdRelocation.id,
        operation_type: "RELOCATION",
        details: {
          old: {
            location: oldLocation,
          },
          new: {
            location: newLocation,
          },
        },
        operation_subject: req?.member?.id,
        note: relocationModel?.note,
      });

      if (!req.body.operation_group) {
        res.status(200).json({ data: createdRelocation, success: true });
      }
    } catch (error: any) {
      console.log(error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteRelocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { relocationId } = req.params;
      const deletedRelocation = await RelocationService.deleteRelocation(relocationId as string);
      res.status(200).json({ data: deletedRelocation, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

import type { Request, Response, NextFunction } from "express";

import { randomUUID } from "crypto";
import { validationResult } from "express-validator";

import CheckService from "../services/CheckService";
import MemberService from "../services/MemberService";
import HttpException from "../exceptions/HttpException";
import LocationService from "../services/LocationService";
import AssignmentController from "./AssignmentController";
import RelocationController from "./RelocationController";
import FixedAssetService from "../services/FixedAssetService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ICheck from "../interfaces/ICheck";

export default class CheckController {
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

      const { checks, pagination } = await CheckService.getAll(workspace, {
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
      res.status(200).json({ data: checks, pagination, success: true });
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
      const { checkId } = req.params;
      const check = await CheckService.getById(checkId as string);

      res.status(200).json({ data: check, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const fixedAsset = await FixedAssetService.getById(requestBody.fixed_asset);
      if (fixedAsset?.current_check) {
        if (fixedAsset.current_check.status === "check-out") {
          requestBody.status = "check-in";
        } else {
          requestBody.status = "check-out";
        }
      } else {
        requestBody.status = "check-out";
      }
      if (requestBody.assignee) {
        requestBody.assignee = await MemberService.getById(requestBody.assignee);
      }
      if (requestBody.location) {
        requestBody.location = await LocationService.getById(requestBody.location);
      }
      if (fixedAsset?.assignee?.id === requestBody.assignee?.id || !requestBody.assignee) {
        requestBody.is_assignment = false;
      }
      if (fixedAsset?.location?.id === requestBody.location?.id || !requestBody.location) {
        requestBody.is_relocation = false;
      }
      if (requestBody.status === "check-out") {
        requestBody.check_in_date = null;
      }
      const checkModel: ICheck = {
        workspace: req.workspace?.id as string,
        fixed_asset: requestBody.fixed_asset,
        status: requestBody.status,
        assignee: requestBody.assignee || null,
        is_assignment: requestBody.is_assignment || false,
        location: requestBody.location || null,
        is_relocation: requestBody.is_relocation || false,
        check_in_date: requestBody.check_in_date || null,
        check_due_date: requestBody.check_due_date || null,
        check_out_date: requestBody.check_out_date || null,
        checked_by: req?.member?.id as string,
        note: requestBody.note || null,
      };

      const createdCheck = await CheckService.createCheck(checkModel);

      if (requestBody.is_assignment || requestBody.is_relocation) {
        req.body.operation_group = {
          name: req.body.status === "check-out" ? "Check Out" : "Check In",
          code: req.body.status === "check-out" ? "__CHECK_OUT__" : "__CHECK_IN__",
          created_by_system: true,
        };
      }
      req.body.operation_key = randomUUID().toString().substring(0, 8);

      if (
        requestBody.is_assignment &&
        requestBody.assignee &&
        fixedAsset?.assignee?.id !== requestBody.assignee?.id
      ) {
        console.log(fixedAsset?.assignee?.id !== requestBody.assignee?.id);
        console.log(fixedAsset?.assignee?.id, requestBody.assignee?.id);
        req.body.new_assignee = requestBody.assignee;
        await AssignmentController.createAssignment(req, res, next);
      }

      if (
        requestBody.is_relocation &&
        requestBody.location &&
        fixedAsset?.location?.id !== requestBody.location?.id
      ) {
        req.body.new_location = requestBody.location;
        await RelocationController.createRelocation(req, res, next);
      }

      return res.status(200).json({ data: createdCheck, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async downloadCheck(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const fixed_asset = req.query.fixed_asset as any;
      const status = req.query.status as any;
      const assignee = req.query.assignee as any;
      const location = req.query.location as any;
      const start_date = req.query.start_date as any;
      const end_date = req.query.end_date as any;

      const checkCSV = await CheckService.downloadCheck(workspace, {
        search,
        status,
        fixed_asset,
        assignee,
        location,
        start_date,
        end_date,
      });

      res.header("Content-Type", "text/csv");
      res.attachment("checks.csv");
      res.send(checkCSV);
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

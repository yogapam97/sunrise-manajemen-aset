import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import LocationService from "../services/LocationService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ILocation from "../interfaces/ILocation";

export default class LocationController {
  private static defineLocationModel(requestBody: ILocation): ILocation {
    const location: ILocation = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      code: requestBody.code || null,
      address: requestBody.address || null,
      description: requestBody.description || null,
      created_by: requestBody.created_by,
    };

    return location;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const page = Number(req.query.page as string);
      const limit = Number(req.query.limit as string);
      const sort = req.query.sort as string;

      const { locations, pagination } = await LocationService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: locations, pagination, success: true });
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
      const { locationId } = req.params;
      const location = await LocationService.getById(locationId as string);
      res.status(200).json({ data: location, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const locationModel = LocationController.defineLocationModel(requestBody);

      const createdLocation = await LocationService.createLocation(locationModel);
      res.status(200).json({ data: createdLocation, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { locationId } = req.params;
      const locationModel = LocationController.defineLocationModel(requestBody);

      const createdLocation = await LocationService.updateLocation(
        locationId as string,
        locationModel
      );

      res.status(200).json({ data: createdLocation, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const location = await LocationService.deleteLocation(locationId as string);
      res.status(200).json({ data: location, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getFixedAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const { locationId } = req.params;
      const { fixedAssets, pagination } = await LocationService.getFixedAssets(
        locationId as string
      );
      res.status(200).json({ data: fixedAssets, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

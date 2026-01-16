import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import SupplierService from "../services/SupplierService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ISupplier from "../interfaces/ISupplier";

export default class SupplierController {
  private static defineSupplierModel(requestBody: ISupplier): ISupplier {
    const supplier: ISupplier = {
      workspace: requestBody.workspace,
      name: requestBody.name,
      code: requestBody.code || null,
      url: requestBody.url || null,
      email: requestBody.email || null,
      phone: requestBody.phone || null,
      address: requestBody.address || null,
      description: requestBody.description || null,
      created_by: requestBody.created_by,
    };

    return supplier;
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);
      const sort = req.query.sort as string;

      const { suppliers, pagination } = await SupplierService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: suppliers, pagination, success: true });
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
      const { supplierId } = req.params;
      const supplier = await SupplierService.getById(supplierId as string);
      res.status(200).json({ data: supplier, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const supplierModel = SupplierController.defineSupplierModel(requestBody);

      const createdSupplier = await SupplierService.createSupplier(supplierModel);
      res.status(200).json({ data: createdSupplier, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      const { supplierId } = req.params;
      const supplierModel = SupplierController.defineSupplierModel(requestBody);

      const createdSupplier = await SupplierService.updateSupplier(
        supplierId as string,
        supplierModel
      );

      res.status(200).json({ data: createdSupplier, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplierId } = req.params;
      const supplier = await SupplierService.deleteSupplier(supplierId as string);
      res.status(200).json({ data: supplier, success: true });
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
      const { supplierId } = req.params;
      const { fixedAssets, pagination } = await SupplierService.getFixedAssets(
        supplierId as string
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

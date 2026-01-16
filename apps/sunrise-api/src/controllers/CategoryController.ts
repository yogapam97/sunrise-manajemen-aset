import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import CategoryService from "../services/CategoryService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type ICategory from "../interfaces/ICategory";

export default class CategoryController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const page = Number(req.query.page as string) || 1;
      const limit = Number(req.query.limit as string) || 0;
      const sort = req.query.sort as string;

      const { categories, pagination } = await CategoryService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      return res.status(200).json({ data: categories, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;

      const category = await CategoryService.getById(categoryId as string);

      res.status(200).json({ data: category, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      requestBody.created_by = req.workspace_member;
      const categoryModel: ICategory = {
        workspace: requestBody.workspace,
        name: requestBody.name,
        code: requestBody.code,
        icon: requestBody.icon,
        description: requestBody.description,
        created_by: requestBody.created_by,
      };

      const createdCategory = await CategoryService.createCategory(categoryModel);
      return res.status(200).json({ data: createdCategory, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      requestBody.workspace = req.workspace;
      requestBody.created_by = req.workspace_member;
      const { categoryId } = req.params;
      const categoryModel: ICategory = {
        workspace: requestBody.workspace,
        name: requestBody.name,
        code: requestBody.code,
        icon: requestBody.icon,
        description: requestBody.description,
        created_by: requestBody.created_by,
      };

      const updatedCategory = await CategoryService.updateCategory(
        categoryId as string,
        categoryModel
      );

      res.status(200).json({ data: updatedCategory, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const deletedCategory = CategoryService.deleteCategory(categoryId as string);
      res.status(200).json({ data: deletedCategory, success: true });
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
      const { categoryId } = req.params;
      const { fixedAssets, pagination } = await CategoryService.getFixedAssets(
        categoryId as string
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

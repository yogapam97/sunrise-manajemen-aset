import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Category from "../models/Category";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

import type ICategory from "../interfaces/ICategory";

export default class CategoryService extends ApiService {
  public static categoryValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: { optional: true, custom: { options: CategoryService.checkInputCategoryCodeExist } },
  };

  public static async checkInputCategoryCodeExist(code: string, { req }: any) {
    if (!code) return true;
    if (req?.params?.categoryId) {
      const { categoryId } = req.params;
      const currentCategory = await Category.findOne({ _id: categoryId, workspace: req.workspace });
      if (currentCategory?.code === code) {
        return true;
      }
    }

    const category = await Category.findOne({ code, workspace: req.workspace });
    if (category) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async checkInputCategoryExist(id: string, { req }: any) {
    if (!id) {
      return true;
    }
    try {
      await CategoryService.checkIdValid(id, "Category");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const category = await Category.findOne({ _id: id, workspace: req.workspace });
    if (category) {
      return true;
    }
    throw new Error("Category does not exist");
  }

  public static async getAll(
    workspace: string,
    options: { search: string; page: number; limit: number; sort: string }
  ): Promise<any> {
    const { search, page, limit, sort } = options;
    const querySort: any = {};
    switch (sort) {
      case "created_at:asc":
        querySort.created_at = 1;
        break;
      case "created_at:desc":
        querySort.created_at = -1;
        break;
      case "updated_at:desc":
        querySort.updated_at = -1;
        break;
      case "name:asc":
        querySort.name = 1;
        break;
      case "name:desc":
        querySort.name = -1;
        break;
      default:
        querySort.updated_at = -1;
        break;
    }
    const categories = await Category.paginate(
      {
        workspace,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      },
      {
        sort: querySort,
        page,
        limit,
        pagination: limit > 0,
        collation: {
          locale: "en",
        },
      }
    );
    return {
      categories: categories.docs,
      pagination: {
        total: categories.totalDocs,
        limit: categories.limit,
        page: categories.page,
        totalPages: categories.totalPages,
        pagingCounter: categories.pagingCounter,
        hasPrevPage: categories.hasPrevPage,
        hasNextPage: categories.hasNextPage,
        prevPage: categories.prevPage,
        nextPage: categories.nextPage,
      },
    };
  }

  public static async getById(categoryId: string): Promise<any> {
    await CategoryService.checkIdValid(categoryId, "Category");
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new HttpException("Category does not exist", 400);
    }
    return category;
  }

  public static async createCategory(categoryModel: ICategory): Promise<any> {
    const createdCategory = await Category.create(categoryModel);
    return createdCategory;
  }

  public static async updateCategory(categoryId: string, categoryModel: ICategory): Promise<any> {
    await CategoryService.checkIdValid(categoryId, "Category");
    const updatedCategory = await Category.findOneAndUpdate({ _id: categoryId }, categoryModel, {
      returnOriginal: false,
    });
    if (!updatedCategory) {
      throw new HttpException("Category does not exist", 400);
    }
    return updatedCategory;
  }

  public static async deleteCategory(categoryId: string): Promise<any> {
    await CategoryService.checkIdValid(categoryId, "Category");
    const category = await Category.findOneAndRemove({ _id: categoryId });
    if (!category) {
      throw new HttpException("Category does not exist", 400);
    }
    return category;
  }

  public static async getFixedAssets(categoryId: string): Promise<any> {
    await CategoryService.checkIdValid(categoryId, "Category");
    const fixedAssets = await FixedAsset.paginate(
      { category: categoryId },
      {
        populate: [
          { path: "metric", select: "name" },
          { path: "location", select: "name" },
          { path: "category", select: "name" },
          { path: "lifecycle", select: "name" },
          { path: "assignee", populate: { path: "user", select: "name" }, select: "user" },
        ],
      }
    );
    return {
      fixedAssets: fixedAssets.docs,
      pagination: {
        total: fixedAssets.totalDocs,
        limit: fixedAssets.limit,
        page: fixedAssets.page,
        totalPages: fixedAssets.totalPages,
        pagingCounter: fixedAssets.pagingCounter,
        hasPrevPage: fixedAssets.hasPrevPage,
        hasNextPage: fixedAssets.hasNextPage,
        prevPage: fixedAssets.prevPage,
        nextPage: fixedAssets.nextPage,
      },
    };
  }
}

import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Supplier from "../models/Supplier";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

import type ISupplier from "../interfaces/ISupplier";

export default class SupplierService extends ApiService {
  public static supplierValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: { optional: true, custom: { options: SupplierService.checkInputSupplierCodeExist } },
  };

  public static async checkInputSupplierCodeExist(code: string, { req }: any) {
    if (req?.params?.supplierId) {
      const { supplierId } = req.params;
      const currentSupplier = await Supplier.findOne({ _id: supplierId, workspace: req.workspace });
      if (currentSupplier?.code === code) {
        return true;
      }
    }

    const supplier = await Supplier.findOne({ code, workspace: req.workspace });
    if (supplier) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async checkInputSupplierExist(id: string, { req }: any) {
    if (!id) {
      return true;
    }
    try {
      await SupplierService.checkIdValid(id, "Supplier");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const supplier = await Supplier.findOne({ _id: id, workspace: req.workspace });
    if (supplier) {
      return true;
    }
    throw new Error("Supplier does not exist");
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

    const suppliers = await Supplier.paginate(
      {
        workspace,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      },
      {
        page,
        limit,
        pagination: limit > 0,
        sort: querySort,
        collation: {
          locale: "en",
        },
      }
    );
    return {
      suppliers: suppliers.docs,
      pagination: {
        total: suppliers.totalDocs,
        limit: suppliers.limit,
        page: suppliers.page,
        totalPages: suppliers.totalPages,
        pagingCounter: suppliers.pagingCounter,
        hasPrevPage: suppliers.hasPrevPage,
        hasNextPage: suppliers.hasNextPage,
        prevPage: suppliers.prevPage,
        nextPage: suppliers.nextPage,
      },
    };
  }

  public static async getById(supplierId: string): Promise<any> {
    await SupplierService.checkIdValid(supplierId, "Supplier");
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      throw new HttpException("Supplier does not exist", 400);
    }
    return supplier;
  }

  public static async createSupplier(supplierModel: ISupplier): Promise<any> {
    const createdSupplier = await Supplier.create(supplierModel);
    return createdSupplier;
  }

  public static async updateSupplier(supplierId: string, supplierModel: ISupplier): Promise<any> {
    await SupplierService.checkIdValid(supplierId, "Supplier");
    const updatedSupplier = await Supplier.findOneAndUpdate({ _id: supplierId }, supplierModel, {
      returnOriginal: false,
    });
    if (!updatedSupplier) {
      throw new HttpException("Supplier does not exist", 400);
    }
    return updatedSupplier;
  }

  public static async deleteSupplier(supplierId: string): Promise<any> {
    await SupplierService.checkIdValid(supplierId, "Supplier");
    const supplier = await Supplier.findOneAndRemove({ _id: supplierId });
    if (!supplier) {
      throw new HttpException("Supplier does not exist", 400);
    }
    return supplier;
  }

  public static async getFixedAssets(supplierId: string): Promise<any> {
    await SupplierService.checkIdValid(supplierId, "Supplier");
    const fixedAssets = await FixedAsset.paginate(
      { supplier: supplierId },
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

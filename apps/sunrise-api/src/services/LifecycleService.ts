import type { Schema } from "express-validator";

import mongoose from "mongoose";

import ApiService from "./ApiService";
import Lifecycle from "../models/Lifecycle";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

import type ILifecycle from "../interfaces/ILifecycle";

export default class LifecycleService extends ApiService {
  public static lifecycleValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: { optional: true, custom: { options: LifecycleService.checkInputLifecycleCodeExist } },
  };

  public static async checkInputLifecycleCodeExist(code: string, { req }: any) {
    if (req?.params?.lifecycleId) {
      const { lifecycleId } = req.params;
      const currentLifecycle = await Lifecycle.findOne({
        _id: lifecycleId,
        workspace: req.workspace,
      });
      if (currentLifecycle?.code === code) {
        return true;
      }
    }

    const lifecycle = await Lifecycle.findOne({ code, workspace: req.workspace });
    if (lifecycle) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async checkInputLifecycleExist(id: string, { req }: any) {
    if (!id) {
      return true;
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Lifecycle does not exist");
    }
    const lifecycle = await Lifecycle.findOne({ _id: id, workspace: req.workspace });
    if (lifecycle) {
      return true;
    }
    throw new Error("Lifecycle does not exist");
  }

  public static async getAll(
    workspace: string,
    options: {
      search: string;
      page: number;
      limit: number;
      sort: string;
      is_maintenance_cycle: string;
    }
  ): Promise<any> {
    const { search, page, limit, sort, is_maintenance_cycle } = options;
    const query: any = { workspace };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    if (is_maintenance_cycle) {
      const parsedIsMaintenanceCycle = is_maintenance_cycle === "true";
      if (parsedIsMaintenanceCycle) {
        query.is_maintenance_cycle = parsedIsMaintenanceCycle;
      } else {
        query.is_maintenance_cycle = { $ne: true };
      }
    }
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

    const lifecycles = await Lifecycle.paginate(query, {
      page,
      limit,
      pagination: limit > 0,
      sort: querySort,
      collation: {
        locale: "en",
      },
    });
    return {
      lifecycles: lifecycles.docs,
      pagination: {
        total: lifecycles.totalDocs,
        limit: lifecycles.limit,
        page: lifecycles.page,
        totalPages: lifecycles.totalPages,
        pagingCounter: lifecycles.pagingCounter,
        hasPrevPage: lifecycles.hasPrevPage,
        hasNextPage: lifecycles.hasNextPage,
        prevPage: lifecycles.prevPage,
        nextPage: lifecycles.nextPage,
      },
    };
  }

  public static async getById(lifecycleId: string): Promise<any> {
    await LifecycleService.checkIdValid(lifecycleId, "Lifecycle");
    const lifecycle = await Lifecycle.findById(lifecycleId);
    if (!lifecycle) {
      throw new HttpException("Lifecycle does not exist", 400);
    }
    return lifecycle;
  }

  public static async createLifecycle(lifecycleModel: ILifecycle): Promise<any> {
    const createdLifecycle = await Lifecycle.create(lifecycleModel);
    return createdLifecycle;
  }

  public static async updateLifecycle(
    lifecycleId: string,
    lifecycleModel: ILifecycle
  ): Promise<any> {
    await LifecycleService.checkIdValid(lifecycleId, "Lifecycle");
    const updatedLifecycle = await Lifecycle.findOneAndUpdate(
      { _id: lifecycleId },
      lifecycleModel,
      {
        returnOriginal: false,
      }
    );
    if (!updatedLifecycle) {
      throw new HttpException("Lifecycle does not exist", 400);
    }
    return updatedLifecycle;
  }

  public static async deleteLifecycle(lifecycleId: string): Promise<any> {
    await LifecycleService.checkIdValid(lifecycleId, "Lifecycle");
    const lifecycle = await Lifecycle.findOneAndRemove({ _id: lifecycleId });
    if (!lifecycle) {
      throw new HttpException("Lifecycle does not exist", 400);
    }
    return lifecycle;
  }

  public static async getFixedAssets(lifecycleId: string): Promise<any> {
    await LifecycleService.checkIdValid(lifecycleId, "Lifecycle");
    const fixedAssets = await FixedAsset.paginate(
      { lifecycle: lifecycleId },
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

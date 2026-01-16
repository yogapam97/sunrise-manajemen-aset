import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import OperationGroup from "../models/OperationGroup";
import HttpException from "../exceptions/HttpException";

import type IOperationGroup from "../interfaces/IOperationGroup";

export default class OperationGroupService extends ApiService {
  public static operationGroupValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: {
      optional: true,
      custom: { options: OperationGroupService.checkInputOperationGroupCodeExist },
    },
  };

  public static async checkInputOperationGroupCodeExist(code: string, { req }: any) {
    if (!code) return true;
    if (req?.params?.operationGroupId) {
      const { operationGroupId } = req.params;
      const currentOperationGroup = await OperationGroup.findOne({
        _id: operationGroupId,
        workspace: req.workspace,
      });
      if (currentOperationGroup?.code === code) {
        return true;
      }
    }

    const operationGroup = await OperationGroup.findOne({ code, workspace: req.workspace });
    if (operationGroup) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async checkInputOperationGroupExist(id: string, { req }: any) {
    if (!id) {
      return true;
    }
    try {
      await OperationGroupService.checkIdValid(id, "OperationGroup");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const operationGroup = await OperationGroup.findOne({ _id: id, workspace: req.workspace });
    if (operationGroup) {
      return true;
    }
    throw new Error("OperationGroup does not exist");
  }

  public static async getAll(
    workspace: string,
    options: { search: string; page: number; limit: number; sort: string }
  ): Promise<any> {
    const { search, page, limit, sort } = options;

    const query: any = { workspace };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const querySort: any = {};
    switch (sort) {
      case "created_at:asc":
        querySort.created_at = 1;
        break;
      case "created_at:desc":
        querySort.created_at = -1;
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

    const operationGroups = await OperationGroup.paginate(query, {
      page,
      limit,
      pagination: limit > 0,
      sort: querySort,
      collation: {
        locale: "en",
      },
    });
    return {
      operationGroups: operationGroups.docs,
      pagination: {
        total: operationGroups.totalDocs,
        limit: operationGroups.limit,
        page: operationGroups.page,
        totalPages: operationGroups.totalPages,
        pagingCounter: operationGroups.pagingCounter,
        hasPrevPage: operationGroups.hasPrevPage,
        hasNextPage: operationGroups.hasNextPage,
        prevPage: operationGroups.prevPage,
        nextPage: operationGroups.nextPage,
      },
    };
  }

  public static async getById(operationGroupId: string): Promise<any> {
    await OperationGroupService.checkIdValid(operationGroupId, "OperationGroup");
    const operationGroup = await OperationGroup.findById(operationGroupId);
    if (!operationGroup) {
      throw new HttpException("OperationGroup does not exist", 400);
    }
    return operationGroup;
  }

  public static async createOperationGroup(operationGroupModel: IOperationGroup): Promise<any> {
    const createdOperationGroup = await OperationGroup.create(operationGroupModel);
    return createdOperationGroup;
  }

  public static async updateOperationGroup(
    operationGroupId: string,
    operationGroupModel: IOperationGroup
  ): Promise<any> {
    await OperationGroupService.checkIdValid(operationGroupId, "OperationGroup");
    const updatedOperationGroup = await OperationGroup.findOneAndUpdate(
      { _id: operationGroupId },
      operationGroupModel,
      {
        returnOriginal: false,
      }
    );
    if (!updatedOperationGroup) {
      throw new HttpException("OperationGroup does not exist", 400);
    }
    return updatedOperationGroup;
  }

  public static async deleteOperationGroup(operationGroupId: string): Promise<any> {
    await OperationGroupService.checkIdValid(operationGroupId, "OperationGroup");
    const operationGroup = await OperationGroup.findOneAndRemove({ _id: operationGroupId });
    if (!operationGroup) {
      throw new HttpException("OperationGroup does not exist", 400);
    }
    return operationGroup;
  }
}

import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Transition from "../models/Transition";
import FixedAsset from "../models/FixedAsset";
import LifecycleService from "./LifecycleService";
import FixedAssetService from "./FixedAssetService";
import HttpException from "../exceptions/HttpException";

import type ITransition from "../interfaces/ITransition";

export default class TransitionService extends ApiService {
  public static transitionValidationSchema: Schema = {
    fixed_asset: { exists: true, errorMessage: "Fixed Asset is required" },
    new_lifecycle: {
      exists: true,
      errorMessage: "Lifecycle is required",
      custom: { options: LifecycleService.checkInputLifecycleExist },
    },
  };

  public static async getAll(
    workspace: string,
    options: { search: string; page: number; limit: number; sort: string }
  ): Promise<any> {
    const { search, page, limit, sort } = options;
    const query: any = { workspace };

    if (search) {
      const fixedAssetIds = await FixedAsset.find({
        workspace,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.fixed_asset = { $in: fixedAssetIds.map((fa) => fa._id) };
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
      default:
        querySort.updated_at = -1;
        break;
    }

    const transitions = await Transition.paginate(query, {
      populate: [
        {
          path: "fixed_asset",
          select: ["name", "code", "thumbnail"],
        },
        { path: "old_lifecycle", select: ["workspace", "name", "code", "color"] },
        { path: "new_lifecycle", select: ["workspace", "name", "code", "color"] },
        {
          path: "transitioned_by",
          select: ["workspace", "user", "email", "code"],
          populate: { path: "user" },
        },
      ],
      page,
      limit,
      pagination: limit > 0,
      sort: querySort,
    });

    return {
      transitions: transitions.docs,
      pagination: {
        total: transitions.totalDocs,
        limit: transitions.limit,
        page: transitions.page,
        totalPages: transitions.totalPages,
        pagingCounter: transitions.pagingCounter,
        hasPrevPage: transitions.hasPrevPage,
        hasNextPage: transitions.hasNextPage,
        prevPage: transitions.prevPage,
        nextPage: transitions.nextPage,
      },
    };
  }

  public static async getById(transitionId: string): Promise<any> {
    await TransitionService.checkIdValid(transitionId, "Transition");
    const transition = await Transition.findById(transitionId);
    if (!transition) {
      throw new HttpException("Deploymnet does not exist", 400);
    }
    return transition;
  }

  public static async createTransition(transitionModel: ITransition): Promise<any> {
    await FixedAssetService.updateFixedAsset(transitionModel.fixed_asset, {
      lifecycle: transitionModel.new_lifecycle,
    });
    const createdTransition = await Transition.create(transitionModel);
    return createdTransition;
  }

  public static async deleteTransition(transitionId: string): Promise<any> {
    await TransitionService.checkIdValid(transitionId, "Transition");
    const deletedTransition = await Transition.findOneAndRemove({ _id: transitionId });
    if (!deletedTransition) {
      throw new HttpException("Transition does not exist", 400);
    }
    return deletedTransition;
  }
}

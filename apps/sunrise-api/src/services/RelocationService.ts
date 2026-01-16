import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Relocation from "../models/Relocation";
import FixedAsset from "../models/FixedAsset";
import LocationService from "./LocationService";
import FixedAssetService from "./FixedAssetService";
import HttpException from "../exceptions/HttpException";

import type IRelocation from "../interfaces/IRelocation";

export default class RelocationService extends ApiService {
  public static relocationValidationSchema: Schema = {
    fixed_asset: { exists: true, errorMessage: "Fixed Asset is required" },
    new_location: {
      exists: true,
      errorMessage: "New Location is required",
      custom: { options: LocationService.checkInputLocationExist },
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

    const relocations = await Relocation.paginate(query, {
      populate: [
        { path: "fixed_asset", select: ["name", "code", "thumbnail"] },
        { path: "old_location", select: ["workspace", "name", "code"] },
        { path: "new_location", select: ["workspace", "name", "code"] },
        {
          path: "relocated_by",
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
      relocations: relocations.docs,
      pagination: {
        total: relocations.totalDocs,
        limit: relocations.limit,
        page: relocations.page,
        totalPages: relocations.totalPages,
        pagingCounter: relocations.pagingCounter,
        hasPrevPage: relocations.hasPrevPage,
        hasNextPage: relocations.hasNextPage,
        prevPage: relocations.prevPage,
        nextPage: relocations.nextPage,
      },
    };
  }

  public static async getById(relocationId: string): Promise<any> {
    await RelocationService.checkIdValid(relocationId, "Relocation");
    const relocation = await Relocation.findById(relocationId);
    if (!relocation) {
      throw new HttpException("Relocation does not exist", 400);
    }
    return relocation;
  }

  public static async createRelocation(relocationModel: IRelocation): Promise<any> {
    await FixedAssetService.updateFixedAsset(relocationModel.fixed_asset, {
      location: relocationModel.new_location,
    });
    const createdRelocation = await Relocation.create(relocationModel);
    return createdRelocation;
  }

  public static async deleteRelocation(relocationId: string): Promise<any> {
    await RelocationService.checkIdValid(relocationId, "Relocation");
    const deletedRelocation = await Relocation.findOneAndRemove({ _id: relocationId });
    if (!deletedRelocation) {
      throw new HttpException("Relocation does not exist", 400);
    }
    return deletedRelocation;
  }
}

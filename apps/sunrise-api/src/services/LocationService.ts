import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Location from "../models/Location";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

import type ILocation from "../interfaces/ILocation";

export default class LocationService extends ApiService {
  public static locationValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: { optional: true, custom: { options: LocationService.checkInputLocationCodeExist } },
  };

  public static async checkInputLocationCodeExist(code: string, { req }: any) {
    if (req?.params?.locationId) {
      const { locationId } = req.params;
      const currentLocation = await Location.findOne({ _id: locationId, workspace: req.workspace });
      if (currentLocation?.code === code) {
        return true;
      }
    }

    const location = await Location.findOne({ code, workspace: req.workspace });
    if (location) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async checkInputLocationExist(id: string, { req }: any) {
    if (!id) {
      return true;
    }
    try {
      await LocationService.checkIdValid(id, "Location");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const location = await Location.findOne({ _id: id, workspace: req.workspace });
    if (location) {
      return true;
    }
    throw new Error("Location does not exist");
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

    const locations = await Location.paginate(
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
      locations: locations.docs,
      pagination: {
        total: locations.totalDocs,
        limit: locations.limit,
        page: locations.page,
        totalPages: locations.totalPages,
        pagingCounter: locations.pagingCounter,
        hasPrevPage: locations.hasPrevPage,
        hasNextPage: locations.hasNextPage,
        prevPage: locations.prevPage,
        nextPage: locations.nextPage,
      },
    };
  }

  public static async getById(locationId: string): Promise<any> {
    await LocationService.checkIdValid(locationId, "Location");
    const location = await Location.findById(locationId);
    if (!location) {
      throw new HttpException("Location does not exist", 400);
    }
    return location;
  }

  public static async createLocation(locationModel: ILocation): Promise<any> {
    const createdLocation = await Location.create(locationModel);
    return createdLocation;
  }

  public static async updateLocation(locationId: string, locationModel: ILocation): Promise<any> {
    await LocationService.checkIdValid(locationId, "Location");
    const updatedLocation = await Location.findOneAndUpdate({ _id: locationId }, locationModel, {
      returnOriginal: false,
    });
    if (!updatedLocation) {
      throw new HttpException("Location does not exist", 400);
    }
    return updatedLocation;
  }

  public static async deleteLocation(locationId: string): Promise<any> {
    await LocationService.checkIdValid(locationId, "Location");
    const location = await Location.findOneAndRemove({ _id: locationId });
    if (!location) {
      throw new HttpException("Location does not exist", 400);
    }
    return location;
  }

  public static async getFixedAssets(locationId: string): Promise<any> {
    await LocationService.checkIdValid(locationId, "Location");
    const fixedAssets = await FixedAsset.paginate(
      { location: locationId },
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

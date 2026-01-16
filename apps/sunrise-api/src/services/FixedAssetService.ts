import type { Schema } from "express-validator";

import mongoose from "mongoose";
import { Parser } from "json2csv";

import ApiService from "./ApiService";
import FileService from "./FileService";
import MetricService from "./MetricService";
import FixedAsset from "../models/FixedAsset";
import LocationService from "./LocationService";
import CategoryService from "./CategoryService";
import LifecycleService from "./LifecycleService";
import HttpException from "../exceptions/HttpException";

import type IFixedAsset from "../interfaces/IFixedAsset";

export default class FixedAssetService extends ApiService {
  public static importedCodes = new Set();

  public static clearImportedCodes() {
    this.importedCodes.clear();
  }

  public static fixedAssetValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    code: {
      optional: { options: { nullable: true } },
      custom: { options: FixedAssetService.checkInputFixedAssetCodeExist },
    },
    type: {
      exists: true,
      errorMessage: "Type is required",
      isIn: {
        options: [["tangible", "intangible"]],
        errorMessage: "Type must be either 'tangible' or 'intangible' with lowercase",
      },
    },
    purchase_cost: {
      optional: true,
      isNumeric: true,
      errorMessage: "Purchase cost must be a number",
    },
    purchase_date: {
      optional: { options: { nullable: true } },
      isISO8601: true,
      errorMessage: "Purchase date must be a valid date",
    },
    warranty_expire_date: {
      optional: { options: { nullable: true } },
      isISO8601: true,
      errorMessage: "Purchase date must be a valid date",
    },
    metric: { optional: true, custom: { options: MetricService.checkInputMetricExist } },
    location: { optional: true, custom: { options: LocationService.checkInputLocationExist } },
    category: { optional: true, custom: { options: CategoryService.checkInputCategoryExist } },
    lifecycle: { optional: true, custom: { options: LifecycleService.checkInputLifecycleExist } },
  };

  public static fixedAssetImportValidationSchema: Schema = {
    "fixedAssets.*.name": {
      notEmpty: {
        errorMessage: "Name should not empty",
      },
    },
    "fixedAssets.*.code": {
      optional: true,
      customSanitizer: {
        options: (value, { req }) => {
          req.code = value;
          return value;
        },
      },
      custom: {
        options: (value, { req }) => {
          // Check if the code contains any spaces
          if (/\s/.test(value)) {
            throw new Error("Code should not contain spaces");
          }

          // Check if the code is unique in memory
          if (this.importedCodes.has(value)) {
            throw new Error("Code must be unique");
          }

          // Add the code to the set of codes
          this.importedCodes.add(value);

          // Check if the code is unique in the database
          return FixedAssetService.checkInputFixedAssetCodeExist(value, { req }).then(
            (isUnique) => {
              if (!isUnique) {
                throw new Error("Code must be unique");
              }
            }
          );
        },
      },
    },
    "fixedAssets.*.serial_number": {
      optional: true,
      exists: {
        errorMessage: "Serial number is required",
      },
    },
    "fixedAssets.*.type": {
      exists: {
        errorMessage: "Type is required",
      },
      isIn: {
        options: [["tangible", "intangible"]],
        errorMessage: "Type must be either 'tangible' or 'intangible' with lowercase",
      },
    },
    "fixedAssets.*.description": {
      optional: true,
      isString: {
        errorMessage: "Description must be a string",
      },
    },
    "fixedAssets.*.purchase_cost": {
      optional: true,
      exists: {
        errorMessage: "Purchase cost is required",
      },
      isNumeric: {
        errorMessage: "Purchase cost must be a number",
      },
    },
    "fixedAssets.*.purchase_date": {
      optional: true,
      exists: {
        errorMessage: "Purchase date is required",
      },
      isDate: {
        errorMessage: "Purchase date must be a valid date",
      },
    },
  };

  public static async checkInputFixedAssetExist(id: string, { req }: any) {
    try {
      await FixedAssetService.checkIdValid(id, "Fixed Asset");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const fixedAsset = await FixedAsset.findOne({ _id: id, workspace: req.workspace });
    if (fixedAsset) {
      return true;
    }
    throw new Error("FixedAsset does not exist");
  }

  public static async checkInputFixedAssetCodeExist(code: string, { req }: any) {
    if (!code) return false;
    if (req?.params?.fixedAssetId) {
      const { fixedAssetId } = req.params;
      const currentFixedAsset = await FixedAsset.findOne({
        _id: fixedAssetId,
        workspace: req.workspace,
      });
      if (currentFixedAsset?.code === code) {
        return true;
      }
    }

    const fixedAsset = await FixedAsset.findOne({ code, workspace: req.workspace });
    if (fixedAsset) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
  }

  public static async getAll(
    workspace: string,
    options: {
      search: string;
      tags: any;
      page: number;
      limit: number;
      lifecycle: any;
      location: any;
      category: any;
      supplier: any;
      assignee: any;
      code: any;
      serial_number: any;
      sort: string;
      current_status: any;
      current_assignee: any;
      current_location: any;
      check_due_start_date: any;
      check_due_end_date: any;
    }
  ): Promise<any> {
    const {
      search,
      tags,
      page,
      limit,
      lifecycle,
      location,
      category,
      supplier,
      assignee,
      code,
      serial_number,
      sort,
      current_status,
      current_assignee,
      current_location,
      check_due_start_date,
      check_due_end_date,
    } = options;
    const query: any = { workspace };
    const orConditions: any[] = [];
    // Add filters based on provided options
    if (code) {
      query.code = { $regex: code, $options: "i" };
    }
    if (serial_number) {
      query.serial_number = { $regex: serial_number, $options: "i" };
    }
    if (search) {
      const fixedAssetIds = await FixedAsset.find({
        workspace,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query._id = { $in: fixedAssetIds.map((fa) => new mongoose.Types.ObjectId(fa._id)) };
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }
    if (lifecycle && lifecycle.length > 0) {
      query.lifecycle = { $in: lifecycle };
    }
    if (location && location.length > 0) {
      query.location = { $in: location };
    }
    if (category && category.length > 0) {
      query.category = { $in: category };
    }
    if (supplier && supplier.length > 0) {
      query.supplier = { $in: supplier };
    }
    if (assignee && assignee.length > 0) {
      query.assignee = { $in: assignee };
    }

    if (current_status && current_status.length > 0) {
      if (current_status.includes("check-in") && !current_status.includes("check-out")) {
        query["current_check.status"] = { $in: ["check-in", null] };
      } else if (current_status.includes("check-in") && current_status.includes("check-out")) {
        query["current_check.status"] = { $in: ["check-out", null] };
      } else {
        query["current_check.status"] = { $in: current_status };
      }
    }

    if (current_assignee && current_assignee.length > 0) {
      orConditions.push({ current_check: { assignee: { $in: current_assignee } } });
      orConditions.push({ assignee: { $in: current_assignee } });
    }

    if (current_location && current_location.length > 0) {
      orConditions.push({ current_check: { location: { $in: current_location } } });
      orConditions.push({ location: { $in: current_location } });
    }

    if (check_due_start_date) {
      query["current_check.check_due_date"] = { $gte: new Date(check_due_start_date) };
    }
    if (check_due_end_date) {
      const endDate = new Date(check_due_end_date);
      endDate.setHours(23, 59, 59, 999);
      query["current_check.check_due_date"] = { $lte: endDate };
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    const querySort: any = {};
    switch (sort) {
      case "created_at:asc":
        querySort.created_at = 1;
        break;
      case "check_expiration_date:asc":
        querySort["current_check.check_due_date"] = 1;
        break;
      case "check_expiration_date:desc":
        querySort["current_check.check_due_date"] = -1;
        break;
      case "maintenance_next_date:asc":
        querySort["current_maintenance.maintenance_next_date"] = 1;
        break;
      case "maintenance_next_date:desc":
        querySort["current_maintenance.maintenance_next_date"] = -1;
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

    const fixedAssets = await FixedAsset.paginate(query, {
      populate: [
        { path: "metric", select: "name" },
        { path: "location", select: ["workspace", "name", "code"] },
        { path: "category", select: ["workspace", "name", "icon", "code"] },
        { path: "lifecycle" },
        { path: "supplier", select: ["workspace", "name", "code"] },
        {
          path: "assignee",
          select: ["workspace", "user", "email", "code"],
          populate: { path: "user" },
        },
        { path: "current_check.assignee.user" },
        { path: "current_check.checked_by" },
        { path: "current_check.checked_by", populate: { path: "user" } },
        { path: "current_maintenance.maintained_by" },
        { path: "current_maintenance.maintained_by", populate: { path: "user" } },
      ],
      sort: querySort,
      page,
      limit,
      paginate: limit > 0,
      collation: {
        locale: "en",
      },
    });
    if (sort === "check_expiration_date:asc") {
      fixedAssets.docs.sort((a, b) => {
        if (!a?.current_check || !b?.current_check) return -1;
        if (a?.current_check?.check_due_date === null) return -1;
        if (b?.current_check?.check_due_date === null) return -1;
        return (
          new Date(a?.current_check?.check_due_date).getTime() -
          new Date(b?.current_check?.check_due_date).getTime()
        );
      });
    }
    if (sort === "maintenance_next_date:asc") {
      fixedAssets.docs.sort((a, b) => {
        if (!a?.current_maintenance || !b?.current_maintenance) return -1;
        if (a?.current_maintenance?.maintenance_next_date === null) return -1;
        if (b?.current_maintenance?.maintenance_next_date === null) return -1;
        return (
          new Date(a?.current_maintenance?.maintenance_next_date).getTime() -
          new Date(b?.current_maintenance?.maintenance_next_date).getTime()
        );
      });
    }

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

  public static async getById(fixedAssetId: string): Promise<any> {
    await FixedAssetService.checkIdValid(fixedAssetId, "Fixed Asset");
    const fixedAsset = await FixedAsset.findOne({ _id: fixedAssetId }).populate([
      { path: "workspace", select: "name" },
      { path: "location", select: ["workspace", "name", "code"] },
      { path: "category", select: ["name", "code"] },
      { path: "lifecycle" },
      { path: "supplier", select: ["name", "code"] },
      {
        path: "assignee",
        select: ["workspace", "user", "email", "code"],
        populate: { path: "user" },
      },
      { path: "current_check.assignee.user" },
      { path: "current_check.checked_by" },
      { path: "current_check.checked_by", populate: { path: "user" } },
    ]);
    if (!fixedAsset) {
      throw new HttpException(`Fixed Asset ${fixedAssetId} does not exist`, 400);
    }
    return fixedAsset;
  }

  public static async createFixedAsset(fixedAssetModel: IFixedAsset): Promise<any> {
    if (fixedAssetModel.thumbnail) {
      const thumbnailURL = new URL(fixedAssetModel.thumbnail);
      const thumbnailFile = thumbnailURL.pathname.split("/").pop();
      await FileService.moveFileToPermanentStorage(
        thumbnailFile as string,
        FileService.thumbnailFilePath
      );
      fixedAssetModel.thumbnail = thumbnailFile as string;
    }
    if (fixedAssetModel.images.length > 0) {
      const imagePromises = fixedAssetModel.images.map(async (imageUrl) => {
        const imageURL = new URL(imageUrl);
        const imageFile = imageURL.pathname.split("/").pop();
        await FileService.moveFileToPermanentStorage(
          imageFile as string,
          FileService.imagesFilePath
        );
        return imageFile as string; // Return the new file name
      });

      // Replace image URLs with new file names after all promises resolve
      fixedAssetModel.images = await Promise.all(imagePromises);
    }

    const createdFixedAsset = await FixedAsset.create(fixedAssetModel);
    return createdFixedAsset;
  }

  public static async importFixedAsset(fixedAssets: any[]): Promise<any> {
    const importedFixedAsset = await FixedAsset.insertMany(fixedAssets);
    return importedFixedAsset;
  }

  public static async updateFixedAsset(fixedAssetId: string, fixedAssetModel: any): Promise<any> {
    await FixedAssetService.checkIdValid(fixedAssetId, "Fixed Asset");

    if (fixedAssetModel.thumbnail) {
      const thumbnailJWT = await FileService.extractJWTFromURL(fixedAssetModel.thumbnail);
      const existingThumbnail = await FileService.getFileFromJWT(thumbnailJWT);
      if (existingThumbnail) {
        delete fixedAssetModel.thumbnail;
      } else if (fixedAssetModel.thumbnail) {
        const thumbnailURL = new URL(fixedAssetModel.thumbnail);
        const thumbnailFile = thumbnailURL.pathname.split("/").pop();
        await FileService.moveFileToPermanentStorage(
          thumbnailFile as string,
          FileService.thumbnailFilePath
        );
        fixedAssetModel.thumbnail = thumbnailFile as string;
      }
    }

    if (fixedAssetModel.images?.length) {
      const imagePromises = fixedAssetModel.images.map(async (imageUrl: string) => {
        const imageJWT = await FileService.extractJWTFromURL(imageUrl);
        const existingImage = await FileService.getFileFromJWT(imageJWT);
        if (existingImage) {
          return existingImage as string;
        }
        const imageURL = new URL(imageUrl);
        const imageFile = imageURL.pathname.split("/").pop();
        await FileService.moveFileToPermanentStorage(
          imageFile as string,
          FileService.imagesFilePath
        );
        return imageFile as string; // Return the new file name
      });

      // Replace image URLs with new file names after all promises resolve
      fixedAssetModel.images = await Promise.all(imagePromises);
    }

    const fixedAsset = await FixedAsset.findByIdAndUpdate({ _id: fixedAssetId }, fixedAssetModel, {
      returnOriginal: false,
    });
    if (!fixedAsset) {
      throw new HttpException("Fixed Asset does not exist", 400);
    }
    return fixedAsset;
  }

  public static async deleteFixedAsset(fixedAssetId: string): Promise<any> {
    await FixedAssetService.checkIdValid(fixedAssetId, "Fixed Asset");
    const fixedAsset = await FixedAsset.findOneAndDelete({ _id: fixedAssetId });
    if (!fixedAsset) {
      throw new HttpException("Fixed Asset does not exist", 400);
    }
    return fixedAsset;
  }

  public static async downloadFixedAsset(
    workspace: string,
    options: {
      search: string;
      lifecycle: any;
      location: any;
      category: any;
      supplier: any;
      assignee: any;
      code: any;
      serial_number: any;
      tags: any;
    }
  ) {
    const { search, lifecycle, location, category, supplier, assignee, code, serial_number, tags } =
      options;
    const query: any = { workspace };
    // Add filters based on provided options

    if (code) {
      query.code = { $regex: code, $options: "i" };
    }
    if (serial_number) {
      query.serial_number = { $regex: serial_number, $options: "i" };
    }

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (lifecycle && lifecycle.length > 0) {
      query.lifecycle = { $in: lifecycle };
    }
    if (location && location.length > 0) {
      query.location = { $in: location };
    }
    if (category && category.length > 0) {
      query.category = { $in: category };
    }
    if (supplier && supplier.length > 0) {
      query.supplier = { $in: supplier };
    }
    if (assignee && assignee.length > 0) {
      query.assignee = { $in: assignee };
    }
    // Perform the query and populate necessary fields
    const fixedAssets = await FixedAsset.find(query)
      .populate([
        { path: "location", select: ["name", "code"] },
        { path: "category", select: ["name", "code"] },
        { path: "lifecycle", select: ["name", "code"] },
        { path: "supplier", select: ["name", "code"] },
        {
          path: "assignee",
          populate: { path: "user", select: "name" },
          select: ["name", "email", "code"],
        },
        {
          path: "current_check",
          populate: [
            {
              path: "checked_by",
              populate: { path: "user" },
            },
            "assignee.user",
          ],
        },
      ])
      .sort({ updated_at: -1 })
      .lean();

    const fields = [
      { label: "Created Datetime", value: "created_at" },
      { label: "Latest Update Datetime", value: "updated_at" },
      { label: "Name", value: "name" },
      { label: "Code", value: "code" },
      { label: "Tags", value: "tags" },
      { label: "Serial Number", value: "serial_number" },
      { label: "Type", value: "type" },
      { label: "Description", value: "description" },
      { label: "Warranty Expire Date", value: "warranty_expire_date" },
      { label: "Purchase Cost", value: "purchase_cost" },
      { label: "Purchase Date", value: "purchase_date" },
      { label: "Lifecycle", value: "lifecycle.name" },
      { label: "Lifecycle Code", value: "lifecycle.code" },
      { label: "Default Location", value: "location.name" },
      { label: "Location Code", value: "location.code" },
      { label: "Category", value: "category.name" },
      { label: "Category Code", value: "category.code" },
      { label: "Supplier", value: "supplier.name" },
      { label: "Supplier Code", value: "supplier.code" },
      { label: "Default Assignee", value: "assignee.user.name" },
      { label: "Assignee Code", value: "assignee.code" },
      { label: "Assignee Email", value: "assignee.email" },
      { label: "Current Status", value: "current_check.status" },
      { label: "Current Assignee", value: "current_check.assignee.user.name" },
      { label: "Current Assignee Email", value: "current_check.assignee.email" },
      { label: "Current Assignee Code", value: "current_check.assignee.code" },
      { label: "Current Location", value: "current_check.location.name" },
      { label: "Current Location Code", value: "current_check.location.code" },
      { label: "Check In Date", value: "current_check.check_in_date" },
      { label: "Check Due Date", value: "current_check.check_due_date" },
      { label: "Check Out Date", value: "current_check.check_out_date" },
      { label: "Check Note", value: "current_check.note" },
      { label: "Check In/Out By", value: "current_check.checked_by.user.name" },
      { label: "Check In/Out By Email", value: "current_check.checked_by.email" },
      { label: "Check In/Out By Code", value: "current_check.checked_by.code" },
    ];
    const json2csvParser = new Parser({ fields, delimiter: ";" });
    const csv = json2csvParser.parse(fixedAssets);
    return csv;
  }

  public static async getReportCount(workspace: string) {
    const fixedAssetCount = await FixedAsset.countDocuments({ workspace });
    return fixedAssetCount;
  }

  public static async getReportTotalPurchaseCost(workspace: string) {
    const result = await FixedAsset.aggregate([
      {
        $match: { workspace: new mongoose.Types.ObjectId(workspace) }, // Assuming workspace is a field in your FixedAsset documents
      },
      {
        $group: {
          _id: null, // Group by null to get a single result
          total_purchase_cost: { $sum: "$purchase_cost" },
        },
      },
    ]);
    return result[0]?.total_purchase_cost || 0;
  }
}

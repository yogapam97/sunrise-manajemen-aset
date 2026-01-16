import type { PipelineStage } from "mongoose";

import mongoose from "mongoose";
import { Parser } from "json2csv";

import ApiService from "./ApiService";
import FileService from "./FileService";
import UserService from "./UserService";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

const depreciationTotalAggregate = (query: any): PipelineStage[] => [
  {
    $match: query,
  },
  {
    $project: {
      purchase_cost: 1,
      active_start_date: 1,
      active_end_date: 1,
    },
  },
  {
    $addFields: {
      depreciation_rate: {
        $divide: [
          "$purchase_cost",
          {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: "$active_end_date",
              unit: "day",
            },
          },
        ],
      },
      days_passed: {
        $cond: {
          if: { $lte: [new Date(), "$active_end_date"] },
          then: {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: new Date(),
              unit: "day",
            },
          },
          else: {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: "$active_end_date",
              unit: "day",
            },
          },
        },
      },
    },
  },
  {
    $addFields: {
      current_purchase_cost: {
        $subtract: [
          "$purchase_cost",
          {
            $multiply: ["$depreciation_rate", "$days_passed"],
          },
        ],
      },
    },
  },
  {
    $group: {
      _id: null,
      total_current_purchase_cost: { $sum: "$current_purchase_cost" },
      total_purchase_cost: { $sum: "$purchase_cost" },
    },
  },
  {
    $project: {
      _id: 0,
      total_current_purchase_cost: {
        $round: ["$total_current_purchase_cost", 2],
      },
      total_purchase_cost: {
        $round: ["$total_purchase_cost", 2],
      },
      depreciation_percentage: {
        $cond: {
          if: { $eq: ["$total_purchase_cost", 0] },
          then: 0,
          else: {
            $round: [
              {
                $subtract: [
                  1,
                  { $divide: ["$total_current_purchase_cost", "$total_purchase_cost"] },
                ],
              },
              4,
            ],
          },
        },
      },
    },
  },
];

const depreciationAggregate = (query: any, querySort: any): PipelineStage[] => [
  {
    $match: query,
  },
  {
    $project: {
      _id: 1,
      id: "$_id",
      workspace: 1,
      name: 1,
      code: 1,
      purchase_date: 1,
      serial_number: 1,
      type: 1,
      description: 1,
      lifecycle: 1,
      category: 1,
      location: 1,
      supplier: 1,
      assignee: 1,
      purchase_cost: 1,
      active_start_date: 1,
      active_end_date: 1,
      thumbnail: 1,
      created_at: 1,
      updated_at: 1,
    },
  },
  {
    $addFields: {
      depreciation_purchase_cost: {
        $divide: [
          "$purchase_cost",
          {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: "$active_end_date",
              unit: "day",
            },
          },
        ],
      },
      days_passed: {
        $cond: {
          if: { $lte: [new Date(), "$active_end_date"] },
          then: {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: new Date(),
              unit: "day",
            },
          },
          else: {
            $dateDiff: {
              startDate: "$active_start_date",
              endDate: "$active_end_date",
              unit: "day",
            },
          },
        },
      },
    },
  },
  {
    $lookup: {
      from: "lifecycles",
      localField: "lifecycle",
      foreignField: "_id",
      as: "lifecycle",
    },
  },
  {
    $unwind: {
      path: "$lifecycle",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "category",
    },
  },
  {
    $unwind: {
      path: "$category",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "locations",
      localField: "location",
      foreignField: "_id",
      as: "location",
    },
  },
  {
    $unwind: {
      path: "$location",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "suppliers",
      localField: "supplier",
      foreignField: "_id",
      as: "supplier",
    },
  },
  {
    $unwind: {
      path: "$supplier",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "workspace_members",
      localField: "assignee",
      foreignField: "_id",
      as: "assignee",
    },
  },
  {
    $unwind: {
      path: "$assignee",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "assignee.user",
      foreignField: "_id",
      as: "assignee.user",
    },
  },
  {
    $unwind: {
      path: "$assignee.user",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      _id: 1,
      id: 1,
      name: 1,
      workspace: 1,
      purchase_date: 1,
      purchase_cost: 1,
      code: 1,
      serial_number: 1,
      type: 1,
      description: 1,
      lifecycle: 1,
      category: 1,
      location: 1,
      supplier: 1,
      assignee: 1,
      thumbnail: 1,
      active_start_date: 1,
      active_end_date: 1,
      days_passed: 1,
      depreciation_rate: "$depreciation_purchase_cost",
      percentage: {
        $round: [
          {
            $divide: [
              "$days_passed",
              {
                $dateDiff: {
                  startDate: "$active_start_date",
                  endDate: "$active_end_date",
                  unit: "day",
                },
              },
            ],
          },
          4,
        ],
      },
      depreciation_purchase_cost: {
        $round: [
          {
            $multiply: ["$depreciation_purchase_cost", "$days_passed"],
          },
          2,
        ],
      },
      current_purchase_cost: {
        $round: [
          {
            $subtract: [
              "$purchase_cost",
              {
                $multiply: ["$depreciation_purchase_cost", "$days_passed"],
              },
            ],
          },
          2,
        ],
      },
      created_at: 1,
      updated_at: 1,
    },
  },
  {
    $sort: querySort,
  },
];

export default class DepreciationService extends ApiService {
  public static async getAll(
    workspace: string,
    options: {
      search: string;
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
    }
  ): Promise<any> {
    const {
      search,
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
    } = options;
    const query: any = {
      workspace: new mongoose.Types.ObjectId(workspace),
      is_calculate_depreciation: true,
    };
    // Add filters based on provided options
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (code) {
      query.code = { $regex: code, $options: "i" };
    }
    if (serial_number) {
      query.serial_number = { $regex: serial_number, $options: "i" };
    }
    if (lifecycle && lifecycle.length > 0) {
      query.lifecycle = { $in: lifecycle.map((l: string) => new mongoose.Types.ObjectId(l)) };
    }
    if (location && location.length > 0) {
      query.location = { $in: location.map((l: string) => new mongoose.Types.ObjectId(l)) };
    }
    if (category && category.length > 0) {
      query.category = { $in: category.map((c: string) => new mongoose.Types.ObjectId(c)) };
    }
    if (supplier && supplier.length > 0) {
      query.supplier = { $in: supplier.map((s: string) => new mongoose.Types.ObjectId(s)) };
    }
    if (assignee && assignee.length > 0) {
      query.assignee = { $in: assignee.map((a: string) => new mongoose.Types.ObjectId(a)) };
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

    const getAllAggregate = depreciationAggregate(query, querySort);

    const depreciations = await FixedAsset.aggregatePaginate(
      FixedAsset.aggregate(getAllAggregate),
      {
        page,
        limit,
      }
    );

    const transformedResults = await Promise.all(
      depreciations.docs.map(async (doc) => {
        const ret = { ...doc }; // Create a shallow copy of the document

        delete ret._id;
        delete ret.__v;

        if (ret.assignee && ret.assignee.user) {
          delete ret.assignee.user.password;

          if (ret.assignee.user.avatar) {
            ret.assignee.user.avatar = FileService.generateJWTForFile(
              UserService.avatarFilePath,
              ret.assignee.user.avatar
            );
          }
        }

        if (ret.thumbnail) {
          const thumbnailJWT = await FileService.generateJWTForFile(
            FileService.thumbnailFilePath,
            ret.thumbnail
          );
          ret.thumbnail = thumbnailJWT;
        }

        return ret;
      })
    );

    return {
      depreciations: transformedResults,
      pagination: {
        total: depreciations.totalDocs,
        limit: depreciations.limit,
        page: depreciations.page,
        totalPages: depreciations.totalPages,
        pagingCounter: depreciations.pagingCounter,
        hasPrevPage: depreciations.hasPrevPage,
        hasNextPage: depreciations.hasNextPage,
        prevPage: depreciations.prevPage,
        nextPage: depreciations.nextPage,
      },
    };
  }

  public static async getById(workspace: string, depreciationId: string): Promise<any> {
    await DepreciationService.checkIdValid(depreciationId, "Depreciation");
    const pipelineAggregate = depreciationAggregate(
      {
        workspace: new mongoose.Types.ObjectId(workspace),
        _id: new mongoose.Types.ObjectId(depreciationId),
      },
      { updated_at: -1 }
    );
    const depreciation = await FixedAsset.aggregate(pipelineAggregate);
    if (!depreciation || depreciation.length === 0) {
      throw new HttpException("Depreciation does not exist", 400);
    }
    return depreciation[0];
  }

  public static async downloadDepreciation(
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
    }
  ): Promise<any> {
    const { search, lifecycle, location, category, supplier, assignee, code, serial_number } =
      options;
    const query: any = {
      workspace: new mongoose.Types.ObjectId(workspace),
      is_calculate_depreciation: true,
    };
    // Add filters based on provided options
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (code) {
      query.code = { $regex: code, $options: "i" };
    }
    if (serial_number) {
      query.serial_number = { $regex: serial_number, $options: "i" };
    }
    if (lifecycle && lifecycle.length > 0) {
      query.lifecycle = { $in: lifecycle.map((l: string) => new mongoose.Types.ObjectId(l)) };
    }
    if (location && location.length > 0) {
      query.location = { $in: location.map((l: string) => new mongoose.Types.ObjectId(l)) };
    }
    if (category && category.length > 0) {
      query.category = { $in: category.map((c: string) => new mongoose.Types.ObjectId(c)) };
    }
    if (supplier && supplier.length > 0) {
      query.supplier = { $in: supplier.map((s: string) => new mongoose.Types.ObjectId(s)) };
    }
    if (assignee && assignee.length > 0) {
      query.assignee = { $in: assignee.map((a: string) => new mongoose.Types.ObjectId(a)) };
    }

    const getAllAggregate = depreciationAggregate(query, { updated_at: -1 });

    const depreciations = await FixedAsset.aggregate(getAllAggregate);

    const fields = [
      { label: "Name", value: "name" },
      { label: "Code", value: "code" },
      { label: "Serial Number", value: "serial_number" },
      { label: "Type", value: "type" },
      { label: "Description", value: "description" },
      { label: "Lifecycle", value: "lifecycle.name" },
      { label: "Lifecycle Code", value: "lifecycle.code" },
      { label: "Location", value: "location.name" },
      { label: "Location Code", value: "location.code" },
      { label: "Category", value: "category.name" },
      { label: "Category Code", value: "category.code" },
      { label: "Supplier", value: "supplier.name" },
      { label: "Supplier Code", value: "supplier.code" },
      { label: "Assignee", value: "assignee.user.name" },
      { label: "Assignee Email", value: "assignee.email" },
      { label: "Purchase Date", value: "purchase_date" },
      { label: "Active Start Date", value: "active_start_date" },
      { label: "Active End Date", value: "active_end_date" },
      { label: "Purchase Cost", value: "purchase_cost" },
      { label: "Depreciation Rate", value: "depreciation_rate" },
      { label: "Total Loss", value: "depreciation_purchase_cost" },
      { label: "Current Value", value: "current_purchase_cost" },
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(depreciations);
    return csv;
  }

  public static async getReportTotalDepreciation(workspace: string) {
    const result = await FixedAsset.aggregate(
      depreciationTotalAggregate({ workspace: new mongoose.Types.ObjectId(workspace) })
    );
    if (result.length > 0) {
      return {
        total_current_purchase_cost: result[0].total_current_purchase_cost,
        depreciation_percentage: result[0].depreciation_percentage,
      };
    }
    return {
      total_current_purchase_cost: 0, // or any default value you prefer
      depreciation_percentage: 0, // or any default value you prefer
    };
  }
}

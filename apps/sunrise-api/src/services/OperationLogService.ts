import moment from "moment";
import mongoose from "mongoose";
import { Parser } from "json2csv";

import ApiService from "./ApiService";
import FixedAsset from "../models/FixedAsset";
import OperationLog from "../models/OperationLog";

type CreateOperationLogParams = {
  workspace: string;
  operation_group: any;
  operation_key: string;
  operation_id: string;
  operation_type: string;
  operation_subject: string;
  fixed_asset: string;
  details: any;
  note: any;
};
export default class OperationLogService extends ApiService {
  private static async generateQuery(workspace: string, options: any) {
    const {
      search,
      operation_group,
      operation_type,
      fixed_asset,
      metric,
      old_location,
      new_location,
      old_assignee,
      new_assignee,
      old_lifecycle,
      new_lifecycle,
      start_date,
      end_date,
    } = options;
    const query: any = { workspace };

    if (search) {
      const fixedAssetIds = await FixedAsset.find({
        workspace,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      query.fixed_asset = { $in: fixedAssetIds.map((fa) => new mongoose.Types.ObjectId(fa._id)) };
    }

    if (fixed_asset && fixed_asset.length > 0) {
      query.fixed_asset = {
        $in: fixed_asset.map((og: string) => og),
      };
    }

    if (operation_group && operation_group.length > 0) {
      query["operation_group._id"] = {
        $in: operation_group.map((og: string) => new mongoose.Types.ObjectId(og)),
      };
    }

    if (operation_type && operation_type.length > 0) {
      query.operation_type = {
        $in: operation_type,
      };
    }

    // Building assignment, relocation, and transition filters
    const orConditions: any[] = [];

    // Audit --------------------------------------------------------------
    if (metric && metric.length > 0) {
      orConditions.push({
        "details.metric._id": {
          $in: metric.map((og: string) => new mongoose.Types.ObjectId(og)),
        },
      });
    }

    // Assignment --------------------------------------------------------------
    if (old_assignee && old_assignee.length > 0) {
      orConditions.push({
        "details.old.assignee.id": {
          $in: old_assignee.map((og: string) => og),
        },
      });
    }

    if (new_assignee && new_assignee.length > 0) {
      orConditions.push({
        "details.new.assignee.id": {
          $in: new_assignee.map((og: string) => og),
        },
      });
    }

    // Relocation --------------------------------------------------------------
    if (old_location && old_location.length > 0) {
      orConditions.push({
        "details.old.location._id": {
          $in: old_location.map((og: string) => new mongoose.Types.ObjectId(og)),
        },
      });
    }

    if (new_location && new_location.length > 0) {
      orConditions.push({
        "details.new.location._id": {
          $in: new_location.map((og: string) => new mongoose.Types.ObjectId(og)),
        },
      });
    }

    // Transition --------------------------------------------------------------
    if (old_lifecycle && old_lifecycle.length > 0) {
      orConditions.push({
        "details.old.lifecycle._id": {
          $in: old_lifecycle.map((og: string) => new mongoose.Types.ObjectId(og)),
        },
      });
    }

    if (new_lifecycle && new_lifecycle.length > 0) {
      orConditions.push({
        "details.new.lifecycle._id": {
          $in: new_lifecycle.map((og: string) => new mongoose.Types.ObjectId(og)),
        },
      });
    }

    if (orConditions.length > 0) {
      query.$or = orConditions;
    }

    if (start_date) {
      query.created_at = { $gte: new Date(start_date) };
    }
    if (end_date) {
      const endDate = new Date(end_date);
      endDate.setHours(23, 59, 59, 999);
      query.created_at = { $lte: endDate };
    }

    return query;
  }

  public static async getAll(
    workspace: string,
    options: {
      search: string;
      page: number;
      limit: number;
      sort: string;
      operation_group: any;
      operation_type: string;
      fixed_asset: any;
      metric: any;
      old_assignee: any;
      new_assignee: any;
      old_location: any;
      new_location: any;
      old_lifecycle: any;
      new_lifecycle: any;
      start_date: any;
      end_date: any;
    }
  ): Promise<any> {
    const { page, limit, sort } = options;

    const query = await this.generateQuery(workspace, options);

    const querySort: any = {};
    switch (sort) {
      case "created_at:asc":
        querySort.created_at = 1;
        break;
      case "created_at:desc":
        querySort.created_at = -1;
        break;
      default:
        querySort.created_at = -1;
        break;
    }

    const operationLogs = await OperationLog.paginate(query, {
      populate: [
        {
          path: "fixed_asset",
        },
        {
          path: "operation_subject",
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
      operationLogs: operationLogs.docs,
      pagination: {
        total: operationLogs.totalDocs,
        limit: operationLogs.limit,
        page: operationLogs.page,
        totalPages: operationLogs.totalPages,
        pagingCounter: operationLogs.pagingCounter,
        hasPrevPage: operationLogs.hasPrevPage,
        hasNextPage: operationLogs.hasNextPage,
        prevPage: operationLogs.prevPage,
        nextPage: operationLogs.nextPage,
      },
    };
  }

  public static async createLog({
    workspace,
    fixed_asset,
    operation_group,
    operation_key,
    operation_id,
    operation_type,
    operation_subject,
    details,
    note,
  }: CreateOperationLogParams): Promise<any> {
    const logEntry = await OperationLog.create({
      workspace,
      operation_group,
      operation_key,
      fixed_asset,
      operation_id,
      operation_type,
      operation_subject,
      details,
      note,
    });
    return logEntry;
  }

  private static consolidateDetails(operation_type: string, details: any) {
    if (operation_type === "AUDIT") {
      if (details?.metric) {
        return `Metric: ${details?.metric?.name}|Value: ${details?.metric?.type === "numerical" ? details?.value : details?.value?.label}`;
      }
    }
    if (operation_type === "ASSIGNMENT") {
      const oldAssignee = details.old?.assignee?.user?.name
        ? `Old Assignee: ${details.old.assignee.user.name}`
        : "";
      const newAssignee = details.new?.assignee?.user?.name
        ? `New Assignee: ${details.new.assignee.user.name}`
        : "";

      return `${oldAssignee}|${newAssignee}`;
    }
    if (operation_type === "RELOCATION") {
      const oldLocation = details.old?.location?.name
        ? `Old Location: ${details.old.location.name}`
        : "";
      const newLocation = details.new?.location?.name
        ? `New Location: ${details.new.location.name}`
        : "";

      return `${oldLocation}|${newLocation}`;
    }
    if (operation_type === "TRANSITION") {
      const oldLifecycle = details.old?.lifecycle?.name
        ? `Old Lifecycle: ${details.old.lifecycle.name}`
        : "";
      const newLifecycle = details.new?.lifecycle?.name
        ? `New Lifecycle: ${details.new.lifecycle.name}`
        : "";

      return `${oldLifecycle}|${newLifecycle}`;
    }

    return "-";
  }

  private static formatData(data: any) {
    return data.map((item: any) => ({
      created_at: moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
      operation_key: item.operation_key,
      operation_type: item?.operation_group?.name || item.operation_type,
      fixed_asset: `Name: ${item?.fixed_asset?.name}|Code: ${item?.fixed_asset?.code}`,
      details: this.consolidateDetails(item.operation_type, item.details),
      note: item.note,
      operated_by: `Name: ${item?.operation_subject?.user?.name}|Email: ${item?.operation_subject?.email}|Code: ${item?.operation_subject?.code}`,
    }));
  }

  public static async downloadOperationLog(
    workspace: string,
    options: {
      search: string;
      sort: string;
      operation_group: any;
      operation_type: string;
      fixed_asset: any;
      metric: any;
      old_assignee: any;
      new_assignee: any;
      old_location: any;
      new_location: any;
      old_lifecycle: any;
      new_lifecycle: any;
      start_date: any;
      end_date: any;
    }
  ) {
    const query = await this.generateQuery(workspace, options);
    // Perform the query and populate necessary fields
    const fixedAssets = await OperationLog.find(query)
      .populate([
        {
          path: "fixed_asset",
        },
        {
          path: "operation_subject",
          select: ["workspace", "user", "email", "code"],
          populate: { path: "user" },
        },
      ])
      .sort({ created_at: -1 })
      .lean();

    const fields = [
      { label: "Date Time", value: "created_at" },
      { label: "Operation Key", value: "operation_key" },
      { label: "Operation Type", value: "operation_type" },
      { label: "Fixed Asset", value: "fixed_asset" },
      { label: "Details", value: "details" },
      { label: "Note", value: "note" },
      { label: "Operated By", value: "operated_by" },
    ];

    const formattedData = this.formatData(fixedAssets);
    const json2csvParser = new Parser({ fields, delimiter: ";" });
    const csv = json2csvParser.parse(formattedData);
    return csv;
  }
}

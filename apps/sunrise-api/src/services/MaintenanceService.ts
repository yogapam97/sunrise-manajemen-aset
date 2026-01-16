import type { Schema } from "express-validator";

import moment from "moment";
import { Parser } from "json2csv";

import ApiService from "./ApiService";
import FixedAsset from "../models/FixedAsset";
import Maintenance from "../models/Maintenance";
import FixedAssetService from "./FixedAssetService";
import HttpException from "../exceptions/HttpException";

import type IMaintenance from "../interfaces/IMaintenance";

export default class MaintenanceService extends ApiService {
  public static maintenanceValidationSchema: Schema = {
    fixed_asset: { exists: true, errorMessage: "Fixed Asset is required" },
  };

  public static async generateQuery(workspace: string, options: any) {
    const { search, status, assignee, location, start_date, end_date } = options;
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

    if (status && status.length > 0) {
      query.status = { $in: status };
    }

    if (assignee && assignee.length > 0) {
      query["assignee._id"] = { $in: assignee };
    }

    if (location && location.length > 0) {
      query["location._id"] = { $in: location };
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
      status: any;
      assignee: any;
      location: any;
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
      case "updated_at:desc":
        querySort.updated_at = -1;
        break;
      default:
        querySort.updated_at = -1;
        break;
    }

    const maintenances = await Maintenance.paginate(query, {
      populate: [
        {
          path: "fixed_asset",
          select: ["name", "code", "thumbnail"],
        },
        {
          path: "maintained_by",
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
      maintenances: maintenances.docs,
      pagination: {
        total: maintenances.totalDocs,
        limit: maintenances.limit,
        page: maintenances.page,
        totalPages: maintenances.totalPages,
        pagingCounter: maintenances.pagingCounter,
        hasPrevPage: maintenances.hasPrevPage,
        hasNextPage: maintenances.hasNextPage,
        prevPage: maintenances.prevPage,
        nextPage: maintenances.nextPage,
      },
    };
  }

  public static async getById(maintenanceId: string): Promise<any> {
    await MaintenanceService.checkIdValid(maintenanceId, "Maintenance");
    const maintenance = await Maintenance.findById(maintenanceId);
    if (!maintenance) {
      throw new HttpException("Deploymnet does not exist", 400);
    }
    return maintenance;
  }

  public static async createMaintenance(maintenanceModel: IMaintenance): Promise<any> {
    const createdMaintenance = await Maintenance.create(maintenanceModel);
    await FixedAssetService.updateFixedAsset(maintenanceModel.fixed_asset, {
      current_maintenance: createdMaintenance,
    });
    return createdMaintenance;
  }

  private static formatData(data: any) {
    return data.map((item: any) => ({
      created_at: moment(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
      status: item.status === "maintenance-in" ? "Maintenance In" : "Maintenance Out",
      fixed_asset: `Name: ${item?.fixed_asset?.name}|Code: ${item?.fixed_asset?.code}`,
      assignee: item.assignee
        ? `Name: ${item?.assignee?.user?.name}|Email: ${item?.assignee?.email}|Code: ${item?.assignee?.code}`
        : "",
      location: item.location ? `Name: ${item.location?.name} | Code: ${item.location?.code}` : "",
      is_assignment: item.is_assignment ? "Yes" : "No",
      is_relocation: item.is_relocation ? "Yes" : "No",
      note: item.note,
      maintained_by: `Name: ${item?.maintained_by?.user?.name}|Email: ${item?.maintained_by?.email}|Code: ${item?.maintained_by?.code}`,
    }));
  }

  public static async downloadMaintenance(
    workspace: string,
    options: {
      search: string;
      status: any;
      fixed_asset: any;
      assignee: any;
      location: any;
      start_date: any;
      end_date: any;
    }
  ) {
    const query = await this.generateQuery(workspace, options);
    // Perform the query and populate necessary fields
    const maintenances = await Maintenance.find(query)
      .populate([
        {
          path: "fixed_asset",
        },
        { path: "assignee.user" },
        {
          path: "maintained_by",
          select: ["workspace", "user", "email", "code"],
          populate: { path: "user" },
        },
      ])
      .sort({ created_at: -1 })
      .lean();

    const fields = [
      { label: "Date Time", value: "created_at" },
      { label: "Status", value: "status" },
      { label: "Fixed Asset", value: "fixed_asset" },
      { label: "Note", value: "note" },
      { label: "Assignee", value: "assignee" },
      { label: "Change Default Assignee", value: "is_assignment" },
      { label: "Location", value: "location" },
      { label: "Change Default Location", value: "is_relocation" },
      { label: "Maintenanceed By", value: "maintained_by" },
    ];

    const formattedData = this.formatData(maintenances);
    const json2csvParser = new Parser({ fields, delimiter: ";" });
    const csv = json2csvParser.parse(formattedData);
    return csv;
  }
}

import type { Schema } from "express-validator";

import Audit from "../models/Audit";
import ApiService from "./ApiService";
import MetricService from "./MetricService";
import FixedAsset from "../models/FixedAsset";
import HttpException from "../exceptions/HttpException";

import type IAudit from "../interfaces/IAudit";

export default class AuditService extends ApiService {
  public static auditValidationSchema: Schema = {
    fixed_asset: { exists: true, errorMessage: "Fixed Asset is required" },
    metric: {
      exists: true,
      errorMessage: "Metric is required",
      custom: { options: MetricService.checkInputMetricExist },
    },
    value: { exists: true, errorMessage: "Value is required" },
  };

  private static async generateQuery(workspace: string, options: any) {
    const { search, metric, start_date, end_date } = options;
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

    if (metric) {
      query.metric = { $in: metric };
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
      metric: any;
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

    const audits = await Audit.paginate(query, {
      populate: [
        {
          path: "fixed_asset",
          select: ["name", "code", "thumbnail"],
        },
        { path: "metric", select: ["workspace", "name", "type"] },
        {
          path: "audited_by",
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
      audits: audits.docs,
      pagination: {
        total: audits.totalDocs,
        limit: audits.limit,
        page: audits.page,
        totalPages: audits.totalPages,
        pagingCounter: audits.pagingCounter,
        hasPrevPage: audits.hasPrevPage,
        hasNextPage: audits.hasNextPage,
        prevPage: audits.prevPage,
        nextPage: audits.nextPage,
      },
    };
  }

  public static async getById(auditId: string): Promise<any> {
    await AuditService.checkIdValid(auditId, "Audit");
    const audit = await Audit.findById(auditId);
    if (!audit) {
      throw new HttpException("Deploymnet does not exist", 400);
    }
    return audit;
  }

  public static async createAudit(auditModel: IAudit): Promise<any> {
    const createdAudit = await Audit.create(auditModel);
    return createdAudit;
  }
}

import type { Schema } from "express-validator";

import Metric from "../models/Metric";
import ApiService from "./ApiService";
import HttpException from "../exceptions/HttpException";

import type IMetric from "../interfaces/IMetric";

export default class MetricService extends ApiService {
  public static metricValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    type: {
      exists: { errorMessage: "Type is Required", bail: true },
      isIn: {
        options: [["numerical", "categorical"]],
        errorMessage: "Type must be either numerical or categorical", // error message if validation fails
      },
    },
  };

  public static metricUpdateValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    type: {
      optional: true,
      exists: { errorMessage: "Type is Required", bail: true },
      isIn: {
        options: [["numerical", "categorical"]],
        errorMessage: "Type must be either numerical or categorical", // error message if validation fails
      },
    },
  };

  public static async checkInputMetricExist(id: string, { req }: any) {
    try {
      await MetricService.checkIdValid(id, "Metric");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const metric = await Metric.findOne({ _id: id, workspace: req.workspace });
    if (metric) {
      return true;
    }
    throw new Error("Metric does not exist");
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

    const metrics = await Metric.paginate(
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
      metrics: metrics.docs,
      pagination: {
        total: metrics.totalDocs,
        limit: metrics.limit,
        page: metrics.page,
        totalPages: metrics.totalPages,
        pagingCounter: metrics.pagingCounter,
        hasPrevPage: metrics.hasPrevPage,
        hasNextPage: metrics.hasNextPage,
        prevPage: metrics.prevPage,
        nextPage: metrics.nextPage,
      },
    };
  }

  public static async getById(metricId: string): Promise<any> {
    await MetricService.checkIdValid(metricId, "Metric");
    const metric = await Metric.findById(metricId);
    if (!metric) {
      throw new HttpException("Metric does not exist", 400);
    }
    return metric;
  }

  public static async createMetric(metricModel: IMetric): Promise<any> {
    const createdMetric = await Metric.create(metricModel);
    return createdMetric;
  }

  public static async updateMetric(metricId: string, metricModel: IMetric): Promise<any> {
    await MetricService.checkIdValid(metricId, "Metric");
    const updatedMetric = await Metric.findOneAndUpdate({ _id: metricId }, metricModel, {
      returnOriginal: false,
    });
    if (!updatedMetric) {
      throw new HttpException("Metric does not exist", 400);
    }
    return updatedMetric;
  }

  public static async deleteMetric(metricId: string): Promise<any> {
    await MetricService.checkIdValid(metricId, "Metric");
    const metric = await Metric.findOneAndDelete({ _id: metricId });
    if (!metric) {
      throw new HttpException("Metric does not exist", 400);
    }
    return metric;
  }
}

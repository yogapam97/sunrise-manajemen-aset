import type { Schema } from "express-validator";

import Goal from "../models/Goal";
import ApiService from "./ApiService";
import MetricService from "./MetricService";
import HttpException from "../exceptions/HttpException";

import type IGoal from "../interfaces/IGoal";

export default class GoalService extends ApiService {
  public static goalValidationSchema: Schema = {
    name: { exists: { errorMessage: "Name is required", bail: true } },
    metric: {
      exists: { errorMessage: "Metric is requierd", bail: true },
      custom: { options: MetricService.checkInputMetricExist, bail: true },
    },
    aggregate: {
      exists: { errorMessage: "Aggregate is required", bail: true },
      isIn: {
        options: [["count", "sum", "average"]],
        errorMessage: "Aggregate must be either count, sum, or average", // error message if validation fails
      },
    },
  };

  public static async getAll(workspaceId: string): Promise<any> {
    const goals = await Goal.find({ workspace: workspaceId }).sort({ updated_at: -1 });
    return goals;
  }

  public static async getById(goalId: string): Promise<any> {
    await GoalService.checkIdValid(goalId, "Goal");
    const goal = await Goal.findById(goalId);
    if (!goal) {
      throw new HttpException("Goal does not exist", 400);
    }
    return goal;
  }

  public static async createGoal(goalModel: IGoal): Promise<any> {
    const createdGoal = await Goal.create(goalModel);
    return createdGoal;
  }

  public static async updateGoal(goalId: string, goalModel: IGoal): Promise<any> {
    await GoalService.checkIdValid(goalId, "Goal");
    const updatedGoal = await Goal.findOneAndUpdate({ _id: goalId }, goalModel, {
      returnOriginal: false,
    });
    if (!updatedGoal) {
      throw new HttpException("Goal does not exist", 400);
    }
    return updatedGoal;
  }

  public static async deleteGoal(goalId: string): Promise<any> {
    await GoalService.checkIdValid(goalId, "Goal");
    const deletedGoal = await Goal.findOneAndDelete({ _id: goalId });
    if (!deletedGoal) {
      throw new HttpException("Goal does not exist", 400);
    }
    return deletedGoal;
  }
}

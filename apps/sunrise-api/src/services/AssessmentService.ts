import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Assessment from "../models/Assessment";
import HttpException from "../exceptions/HttpException";

import type IAssessment from "../interfaces/IAssessment";

export default class AssessmentService extends ApiService {
  public static assessmentValidationSchema: Schema = {
    fixed_asset: { exists: true, errorMessage: "Fixed Asset is required" },
    value: { exists: true, errorMessage: "Fixed Asset is required" },
  };

  public static async getAll(workspaceId: string): Promise<any> {
    const assessments = await Assessment.find({ workspace: workspaceId }).sort({ updated_at: -1 });
    return assessments;
  }

  public static async getById(assessmentId: string): Promise<any> {
    await AssessmentService.checkIdValid(assessmentId, "Assessment");
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new HttpException("Assessment does not exist", 400);
    }
    return assessment;
  }

  public static async createAssessment(assessmentModel: IAssessment): Promise<any> {
    const createdAssessment = await Assessment.create(assessmentModel);
    return createdAssessment;
  }

  public static async deleteAssessment(assessmentId: string): Promise<any> {
    await AssessmentService.checkIdValid(assessmentId, "Assessment");
    const deletedAssessment = await Assessment.findOneAndRemove({ _id: assessmentId });
    if (!deletedAssessment) {
      throw new HttpException("Assessment does not exist", 400);
    }
    return deletedAssessment;
  }
}

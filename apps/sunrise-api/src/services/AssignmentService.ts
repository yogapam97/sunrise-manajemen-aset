import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Assignment from "../models/Assignment";
import FixedAsset from "../models/FixedAsset";
import WorkspaceService from "./WorkspaceService";
import FixedAssetService from "./FixedAssetService";
import HttpException from "../exceptions/HttpException";

import type IAssignment from "../interfaces/IAssignment";

export default class AssignmentService extends ApiService {
  public static assignmentValidationSchema: Schema = {
    fixed_asset: {
      exists: true,
      errorMessage: "Fixed Asset is required",
      custom: { options: FixedAssetService.checkInputFixedAssetExist },
    },
    new_assignee: {
      exists: true,
      errorMessage: "New Assignee is required",
      custom: { options: WorkspaceService.checkInputMemberExist },
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

    const assignments = await Assignment.paginate(query, {
      populate: [
        { path: "fixed_asset", select: ["name", "code", "thumbnail"] },
        { path: "old_assignee", populate: { path: "user" } },
        { path: "new_assignee", populate: { path: "user" } },
        {
          path: "assigned_by",
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
      assignments: assignments.docs,
      pagination: {
        total: assignments.totalDocs,
        limit: assignments.limit,
        page: assignments.page,
        totalPages: assignments.totalPages,
        pagingCounter: assignments.pagingCounter,
        hasPrevPage: assignments.hasPrevPage,
        hasNextPage: assignments.hasNextPage,
        prevPage: assignments.prevPage,
        nextPage: assignments.nextPage,
      },
    };
  }

  public static async getById(assignmentId: string): Promise<any> {
    await AssignmentService.checkIdValid(assignmentId, "Assignment");
    const assignment = Assignment.findById(assignmentId);
    if (!assignment) {
      throw new HttpException("Assignment does not exist");
    }
    return assignment;
  }

  public static async createAssignment(assignmentModel: IAssignment): Promise<any> {
    await FixedAssetService.updateFixedAsset(assignmentModel.fixed_asset, {
      assignee: assignmentModel.new_assignee,
    });
    const createdAssignment = await Assignment.create(assignmentModel);
    const returnAssignment = await createdAssignment.populate([
      "fixed_asset",
      "old_assignee",
      "new_assignee ",
      {
        path: "assigned_by",
        model: "Member",
        populate: {
          path: "user",
          model: "User",
        },
      },
    ]);
    return returnAssignment;
  }

  public static async deleteAssignment(assignmentId: string): Promise<any> {
    await AssignmentService.checkIdValid(assignmentId, "Assignment");
    const deletedAssignment = await Assignment.findOneAndRemove({ _id: assignmentId });
    if (!deletedAssignment) {
      throw new HttpException("Assignment does not exist", 400);
    }
    return deletedAssignment;
  }
}

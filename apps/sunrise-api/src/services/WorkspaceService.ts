import type { PipelineStage } from "mongoose";
import type { Schema } from "express-validator";

import ejs from "ejs";
import path from "path";
import mongoose from "mongoose";

import Member from "../models/Member";
import ApiService from "./ApiService";
import UserService from "./UserService";
import FileService from "./FileService";
import EmailService from "./EmailService";
import Workspace from "../models/Workspace";
import HttpException from "../exceptions/HttpException";
import WorkspaceException from "../exceptions/WorkspaceException";

import type IWorkspace from "../interfaces/IWorkspace";

interface MemberModel {
  role: string;
  admin_permissions: Array<string>;
}

const validAdminPermissions = ["manage_workspace", "manage_workspace_members"];
export default class WorkspaceService extends ApiService {
  public static workspaceInviteValidation: Schema = {
    email: {
      exists: { errorMessage: "Email is Required", bail: true },
      isEmail: { errorMessage: "Invalid Email", bail: true },
      custom: { options: WorkspaceService.checkEmailInvited, bail: true },
    },
    role: {
      exists: { errorMessage: "Role is Required", bail: true },
      isIn: {
        options: [["admin", "user", "auditor"]],
        errorMessage: "Role must be either admin, user, or auditor", // error message if validation fails
      },
    },
  };

  public static workspaceCreateValidation: Schema = {
    name: {
      exists: { errorMessage: "Name is Required", bail: true },
    },
    currency: {
      exists: { errorMessage: "Currency is Required", bail: true },
    },
  };

  public static workspaceUpdateValidation: Schema = {
    name: {
      exists: { errorMessage: "Name is Required", bail: true },
    },
    currency: {
      exists: { errorMessage: "Currency is Required", bail: true },
    },
    workspace: { optional: true, custom: { options: WorkspaceService.checkInputWorkspaceExist } },
  };

  public static async checkInputWorkspaceExist(id: string, { req }: any) {
    await WorkspaceService.checkIdValid(id, "Workspace");
    const workspace = await Workspace.findOne({ _id: id });
    if (workspace) {
      return true;
    }
    throw new Error("Workspace does not exist");
  }

  public static memberEditValidation: Schema = {
    role: {
      exists: { errorMessage: "Role is Required", bail: true },
      isIn: {
        options: [["admin", "user", "auditor"]],
        errorMessage: "Role must be either admin, user, or auditor", // error message if validation fails
      },
    },
    admin_permissions: {
      optional: true,
      custom: {
        options: (admin_permissions: Array<string>, { req }) => {
          const { role } = req.body;
          if (role !== "admin" && admin_permissions.length) {
            throw new Error("Admin permission is not allowed");
          }
          const valid = admin_permissions.every((permission) =>
            validAdminPermissions.includes(permission)
          );
          if (!valid) {
            throw new Error("Invalid admin permission");
          }
          return true;
        },
      },
    },
  };

  public static async getAll(options: {
    email: string;
    page: number;
    limit: number;
    sort: string;
    search: string;
    invitation_status: string;
  }): Promise<any> {
    const { email, search, page, limit, sort, invitation_status } = options;
    const filterInvitationStatus = invitation_status
      ? [invitation_status]
      : ["mastered", "accepted"];

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

    const aggregate = Member.aggregate([
      {
        $match: {
          email,
          invitation_status: { $in: filterInvitationStatus },
        },
      },
      {
        $lookup: {
          from: "workspaces", // the name of the workspace collection
          localField: "workspace",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $unwind: "$workspace",
      },
      {
        $match: {
          "workspace.name": { $regex: search, $options: "i" },
        },
      },
      {
        $project: {
          name: "$workspace.name",
          logo: "$workspace.logo",
          default_icon: "$workspace.default_icon",
          id: "$workspace._id",
          role: 1,
          invitation_status: 1,
          created_at: 1,
        },
      },
    ]);

    const memberWorkspaces = await Member.aggregatePaginate(aggregate, {
      page,
      limit,
      sort: querySort,
    });

    memberWorkspaces.docs = memberWorkspaces.docs.map((result) => {
      if (result.logo) {
        result.logo = FileService.generateJWTForFile(FileService.logoFilePath, result.logo);
      }
      return result;
    });

    return {
      workspaces: memberWorkspaces.docs,
      pagination: {
        total: memberWorkspaces.totalDocs,
        limit: memberWorkspaces.limit,
        page: memberWorkspaces.page,
        totalPages: memberWorkspaces.totalPages,
        pagingCounter: memberWorkspaces.pagingCounter,
        hasPrevPage: memberWorkspaces.hasPrevPage,
        hasNextPage: memberWorkspaces.hasNextPage,
        prevPage: memberWorkspaces.prevPage,
        nextPage: memberWorkspaces.nextPage,
      },
    };
  }

  public static async checkEmailInvited(email: string, { req }: any) {
    const workspaceId = req.workspace?.id;
    try {
      await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const invitedUser = await Member.findOne({ email, workspace: workspaceId });
    if (invitedUser) {
      throw new Error("Email already invited");
    } else {
      return true;
    }
  }

  public static async checkInputMemberExist(id: string, { req }: any) {
    const workspaceId = req.workspace?.id;
    try {
      await WorkspaceService.checkIdValid(id, "Workspace Member");
      await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const member = await Member.findOne({ _id: id, workspace: workspaceId });
    if (member) {
      return true;
    }
    throw new Error("Workspace Member does not exist");
  }

  public static async sendEmailWorkspaceInvitation(userEmail: any, workspaceName: string) {
    const transporter = EmailService.emailTransporter();
    const templatePath = path.resolve(__dirname, "../views/email/invite-workspace/index.ejs");
    const templateData = {
      workspaceName,
    };
    const renderedHTML = await ejs.renderFile(templatePath, templateData);

    const mailOptions = {
      from: process.env.EMAIL_SMTP_ACCOUNT,
      to: userEmail,
      subject: "Stageholder - Workspace Invitation",
      html: renderedHTML,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  public static async getById(workspaceId: string): Promise<any> {
    await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    const workspace = await Workspace.findById(workspaceId).populate(["created_by"]);
    if (!workspace) {
      throw new WorkspaceException();
    }
    return workspace;
  }

  public static async selectWorkspace(workspaceId: string, memberId: string): Promise<any> {
    const aggregatePipeline: PipelineStage[] = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(memberId),
          workspace: new mongoose.Types.ObjectId(workspaceId),
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace",
          foreignField: "_id",
          as: "workspace",
        },
      },
      { $unwind: "$workspace" },
      {
        $lookup: {
          from: "users",
          localField: "workspace.created_by",
          foreignField: "_id",
          as: "created_by",
        },
      },
      {
        $unwind: "$created_by",
      },
      {
        $project: {
          id: "$workspace._id",
          name: "$workspace.name",
          email: "$workspace.email",
          default_icon: "$workspace.default_icon",
          phone: "$workspace.phone",
          description: "$workspace.description",
          currency: "$workspace.currency",
          invitation_status: 1,
          role: 1,
          logo: "$workspace.logo",
          created_by: "$created_by",
          created_at: "$workspace.created_at",
        },
      },
    ];
    const selectedWorkspace = await Member.aggregate(aggregatePipeline);
    if (selectedWorkspace.length > 0) {
      const thisWorkspace = selectedWorkspace[0];
      if (thisWorkspace.logo) {
        thisWorkspace.logo = FileService.generateJWTForFile(
          FileService.logoFilePath,
          thisWorkspace.logo
        );
      }
      return thisWorkspace;
    }
    return null;
  }

  public static async getMemberById(memberId: string): Promise<any> {
    await WorkspaceService.checkIdValid(memberId, "Workspace Member");
    const member = Member.findById(memberId);
    if (!member) {
      throw new HttpException("Member does not exist", 400);
    }
    return member;
  }

  public static async createWorkspace(workspaceModel: IWorkspace): Promise<any> {
    if (workspaceModel.logo) {
      const logoURL = new URL(workspaceModel.logo);
      const logoFile = logoURL.pathname.split("/").pop();
      await FileService.moveFileToPermanentStorage(logoFile as string, FileService.logoFilePath);
      workspaceModel.logo = logoFile as string;
    }
    const createdWorkspace = await Workspace.create(workspaceModel);
    const user = await UserService.findById(workspaceModel.created_by);

    await Member.create({
      user: workspaceModel.created_by,
      role: "admin",
      admin_pemissions: ["manage_workspace", "manage_workspace_members"],
      invitation_status: "mastered",
      email: user.email,
      workspace: createdWorkspace.id,
    });
    return createdWorkspace;
  }

  public static async updateWorkspace(workspaceId: string, workspaceModel: any): Promise<any> {
    await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    if (workspaceModel.logo !== null) {
      const logoJWT = await FileService.extractJWTFromURL(workspaceModel.logo);
      const existingLogo = await FileService.getFileFromJWT(logoJWT);
      if (existingLogo) {
        delete workspaceModel.logo;
      } else if (workspaceModel.logo) {
        const logoURL = new URL(workspaceModel.logo);
        const logoFile = logoURL.pathname.split("/").pop();
        await FileService.moveFileToPermanentStorage(logoFile as string, FileService.logoFilePath);
        workspaceModel.logo = logoFile as string;
      }
    }
    const updatedWorkspace = await Workspace.findOneAndUpdate(
      { _id: workspaceId },
      workspaceModel,
      {
        returnOriginal: false,
      }
    );
    if (!updatedWorkspace) {
      throw new HttpException("Workspace does not exist", 400);
    }
    return updatedWorkspace;
  }

  public static async deleteWorkspace(workspaceId: string): Promise<any> {
    await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    const deletedWorkspace = await Workspace.findOneAndDelete({ _id: workspaceId });
    if (!deletedWorkspace) {
      throw new HttpException("Workspace does not exist");
    }
    return deletedWorkspace;
  }

  public static async invite(workspace: string, email: string, role: string): Promise<any> {
    const user = await UserService.findByEmail(email);
    const thisWorkspace = await WorkspaceService.getById(workspace);
    const member = await Member.create({
      user: user?.id || null,
      workspace,
      email,
      role,
    });
    await WorkspaceService.sendEmailWorkspaceInvitation(email, thisWorkspace?.name as string);

    return member;
  }

  public static async responseInvitation(
    workspaceId: string,
    email: string,
    responseInvite: string
  ) {
    const memberResponse: any = await Member.findOne({ email, workspace: workspaceId });
    if (memberResponse.invitation_status !== "pending") {
      throw new HttpException("Invitation have been responded", 400);
    }

    if (!memberResponse) {
      throw new HttpException("Member does not exist", 400);
    }

    memberResponse.invitation_status = responseInvite;
    memberResponse.save();

    return memberResponse;
  }

  public static async getAllMember(workspaceId: string): Promise<any> {
    const members = await Member.find({ workspace: workspaceId });
    return members;
  }

  public static async getMemberBySub(
    workspaceId: string,
    userId: string,
    invitation_status: string[] = ["mastered", "accepted"]
  ): Promise<any> {
    await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    const member = await Member.findOne({
      workspace: workspaceId,
      user: userId,
      invitation_status: { $in: invitation_status },
    });
    if (!member) {
      throw new HttpException("Invalid Member", 400);
    }
    return member;
  }

  public static async getMemberByEmail(workspaceId: string, email: string): Promise<any> {
    await WorkspaceService.checkIdValid(workspaceId, "Workspace");
    const member = await Member.findOne({ workspace: workspaceId, email });
    if (!member) {
      throw new HttpException("Invalid Member", 400);
    }
    return member;
  }

  public static async updateMember(memberId: string, memberModel: MemberModel) {
    await WorkspaceService.checkIdValid(memberId, "Workspace Member");
    const member: any = await Member.findById({ _id: memberId });
    if (!member) {
      throw new HttpException("Member does not exist", 400);
    }
    if (memberModel.role === "admin") {
      member.admin_permissions = memberModel.admin_permissions || [];
    } else {
      member.admin_permissions = [];
    }
    member.role = memberModel.role;
    const savedMember = await member.save();
    return savedMember;
  }

  public static async deleteMember(memberId: string): Promise<any> {
    await WorkspaceService.checkIdValid(memberId, "Workspace Member");
    const deletedMember = await Member.findOneAndDelete({ _id: memberId });
    if (!deletedMember) {
      throw new HttpException("Member does not exist", 400);
    }
    return deletedMember;
  }
}

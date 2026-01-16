import type { Schema } from "express-validator";

import ejs from "ejs";
import path from "path";

import Member from "../models/Member";
import ApiService from "./ApiService";
import UserService from "./UserService";
import AuthService from "./AuthService";
import EmailService from "./EmailService";
import Workspace from "../models/Workspace";
import FixedAsset from "../models/FixedAsset";
import WorkspaceService from "./WorkspaceService";
import HttpException from "../exceptions/HttpException";

interface MemberModel {
  role: string;
  admin_permissions: Array<string>;
  code: string;
}

const validAdminPermissions = ["manage_workspace", "manage_workspace_members"];
export default class MemberService extends ApiService {
  public static memberInviteValidation: Schema = {
    email: {
      exists: { errorMessage: "Email is Required", bail: true },
      isEmail: { errorMessage: "Invalid Email", bail: true },
      custom: { options: MemberService.checkEmailInvited, bail: true },
    },
    code: { optional: true, custom: { options: MemberService.checkInputMemberCodeExist } },
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
    workspace: { optional: true, custom: { options: MemberService.checkInputWorkspaceExist } },
  };

  public static async checkInputWorkspaceExist(id: string, { req }: any) {
    await MemberService.checkIdValid(id, "Workspace");
    const workspace = await Workspace.findOne({ _id: id });
    if (workspace) {
      return true;
    }
    throw new Error("Workspace does not exist");
  }

  public static async checkInputMemberCodeExist(code: string, { req }: any) {
    if (!code) return false;
    if (req?.params?.memberId) {
      const { memberId } = req.params;
      const currentMember = await Member.findOne({ _id: memberId, workspace: req.workspace });
      if (currentMember?.code === code) {
        return true;
      }
    }

    const member = await Member.findOne({ code, workspace: req.workspace });
    if (member) {
      throw new Error("Code have been registered");
    } else {
      return true;
    }
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

  public static async checkEmailInvited(email: string, { req }: any) {
    const workspaceId = req.workspace?.id;
    try {
      await MemberService.checkIdValid(workspaceId, "Workspace");
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
      await MemberService.checkIdValid(id, "Workspace Member");
      await MemberService.checkIdValid(workspaceId, "Workspace");
    } catch (error: any) {
      throw new Error(error.message);
    }
    const member = await Member.findOne({ _id: id, workspace: workspaceId });
    if (member) {
      return true;
    }
    throw new Error("Workspace Member does not exist");
  }

  public static async sendEmailWorkspaceInvitation(userEmail: any, workspace: any) {
    const transporter = EmailService.emailTransporter();
    const templatePath = path.resolve(__dirname, "../views/email/invite-workspace/index.ejs");
    const templateData = {
      workspaceName: workspace?.name,
      link: `${process.env.APP_HOST}/workspace?tab=invitedWorkspace`,
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

  public static async getById(memberId: string): Promise<any> {
    await MemberService.checkIdValid(memberId, "Workspace Member");
    const member = await Member.findById(memberId).populate("user");
    if (!member) {
      throw new HttpException("Member does not exist", 400);
    }
    return member;
  }

  public static async invite(
    workspaceId: string,
    { email, role, code }: { email: string; role: string; code: string }
  ): Promise<any> {
    const user = await UserService.findByEmail(email);
    const thisWorkspace = await WorkspaceService.getById(workspaceId);
    const member = await Member.create({
      user: user?.id || null,
      workspace: workspaceId,
      email,
      role,
      code,
    });
    MemberService.sendEmailWorkspaceInvitation(email, thisWorkspace);

    return member;
  }

  public static async resendInvitation(workspaceId: string, memberId: string) {
    const member = await Member.findById(memberId);
    if (!member) {
      throw new HttpException("Member does not exist", 400);
    }
    member.invitation_status = "pending";
    const saveMember = await member.save();
    if (!saveMember) {
      throw new HttpException("Failed to resend invitation", 400);
    }
    const thisWorkspace = await WorkspaceService.getById(workspaceId);
    await MemberService.sendEmailWorkspaceInvitation(member?.email, thisWorkspace);

    return true;
  }

  public static async resetPassword(memberId: string) {
    await MemberService.checkIdValid(memberId, "Workspace Member");
    const member = await Member.findById(memberId);
    if (!member) {
      throw new HttpException("Member does not exist", 400);
    }
    AuthService.sendEmailResetPassword(member.email);
    return true;
  }

  public static async responseInvitation(memberId: string, responseInvite: string) {
    await MemberService.checkIdValid(memberId, "Workspace Member");
    const memberResponse: any = await Member.findOne({ _id: memberId });
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

  public static async getAll(
    workspace: string,
    options: { search: string; page: number; limit: number; sort: string }
  ): Promise<any> {
    const { search, page, limit, sort } = options;
    const query: any = {
      workspace,
    };

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

    const members = await Member.paginate(query, {
      page,
      limit,
      populate: {
        path: "user",
        select: ["name", "email", "avatar", "email_verified"],
      },
      sort: querySort,
      pagination: limit > 0,
    });

    const filteredMembers = members.docs.filter(
      (member) =>
        member.email.match(new RegExp(search, "i")) ||
        (member.code && member.code.match(new RegExp(search, "i"))) ||
        (member.user && member.user.name.match(new RegExp(search, "i")))
    );

    return {
      members: filteredMembers,
      pagination: {
        total: members.totalDocs,
        limit: members.limit,
        page: members.page,
        totalPages: members.totalPages,
        pagingCounter: members.pagingCounter,
        hasPrevPage: members.hasPrevPage,
        hasNextPage: members.hasNextPage,
        prevPage: members.prevPage,
        nextPage: members.nextPage,
      },
    };
  }

  public static async getBySub(workspaceId: string, userId: string): Promise<any> {
    await MemberService.checkIdValid(workspaceId, "Workspace");
    const member = await Member.findOne({ workspace: workspaceId, user: userId }).populate([
      "user",
    ]);
    if (!member) {
      throw new HttpException("Invalid Member", 400);
    }
    return member;
  }

  public static async updateMember(memberId: string, memberModel: MemberModel): Promise<any> {
    await MemberService.checkIdValid(memberId, "Workspace Member");
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
    member.code = memberModel?.code;
    const savedMember = await member.save();
    return savedMember;
  }

  public static async deleteMember(memberId: string): Promise<any> {
    await MemberService.checkIdValid(memberId, "Workspace Member");
    const deletedMember = await Member.findOneAndDelete({ _id: memberId });
    if (!deletedMember) {
      throw new HttpException("Member does not exist", 400);
    }
    return deletedMember;
  }

  public static async getFixedAssets(memberId: string): Promise<any> {
    await MemberService.checkIdValid(memberId, "Member");
    const fixedAssets = await FixedAsset.paginate(
      { assignee: memberId },
      {
        populate: [
          { path: "metric", select: "name" },
          { path: "location", select: "name" },
          { path: "category", select: "name" },
          { path: "member", select: "name" },
          { path: "assignee", populate: { path: "user", select: "name" }, select: "user" },
        ],
      }
    );
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
}

import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import MemberService from "../services/MemberService";
import HttpException from "../exceptions/HttpException";
import errorValidationHandler from "../utils/errorValidationHandler";

export default class MemberController {
  public static async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const workspaceId = req.workspace?.id as string;
      const { email, role, code } = req.body;
      const workspaceMember = await MemberService.invite(workspaceId, { email, role, code });
      res.status(200).json({ data: workspaceMember, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const workspace = req.workspace?.id as string;
      const search = req.query.search as string;
      const page = Number(req.query.page as string) || 1;
      const limit = Number(req.query.limit as string) || 0;
      const sort = req.query.sort as string;

      const { members, pagination } = await MemberService.getAll(workspace, {
        search,
        page,
        limit,
        sort,
      });
      res.status(200).json({ data: members, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      const member = await MemberService.getById(memberId as string);
      res.status(200).json({ success: true, data: member });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async acceptInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      await MemberService.responseInvitation(memberId as string, "accepted");
      res.status(200).json({ success: true, message: "Member Invitation successfully accepted" });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      MemberService.resetPassword(memberId as string);
      res.status(200).json({ success: true, message: "Reset Password Email Sended!" });
    } catch (error) {
      console.error("Error during password reset request:", error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async resendInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const workspaceId = req.workspace?.id as string;
      const { memberId } = req.params;
      await MemberService.resendInvitation(workspaceId, memberId as string);
      res.status(200).json({ message: "Resend Invitation Success", success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async rejectInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      await MemberService.responseInvitation(memberId as string, "rejected");
      res.status(200).json({ success: true, message: "Member Invitation successfully rejected" });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateMember(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }
      const { memberId } = req.params;
      const memberModel = {
        role: req.body.role,
        admin_permissions: req.body.admin_permissions,
        code: req.body.code,
      };
      const member = await MemberService.updateMember(memberId as string, memberModel);
      res.status(200).json({ success: true, data: member });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      await MemberService.deleteMember(memberId as string);
      res.status(200).json({ success: true, message: "Member successfully deleted" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getFixedAssets(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      const { fixedAssets, pagination } = await MemberService.getFixedAssets(memberId as string);
      res.status(200).json({ data: fixedAssets, pagination, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

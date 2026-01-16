import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import HttpException from "../exceptions/HttpException";
import WorkspaceService from "../services/WorkspaceService";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IWorkspace from "../interfaces/IWorkspace";

export default class WorkspaceController {
  public static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const email: string = req.user?.email as string;
      const search: string = req.query.search as string;
      const invitation_status: string = req.query.invitation_status as string;
      const sort = req.query.sort as string;
      const limit = Number(req.query.limit as string);
      const page = Number(req.query.page as string);

      const { workspaces, pagination } = await WorkspaceService.getAll({
        email,
        search,
        invitation_status,
        sort,
        limit,
        page,
      });
      return res.status(200).json({ data: workspaces, pagination, success: true });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const workspace = await WorkspaceService.getById(workspaceId as string);
      res.status(200).json({ data: workspace, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async selectWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const { member } = req;
      const workspace = await WorkspaceService.selectWorkspace(
        workspaceId as string,
        member?.id as string
      );
      return res.status(200).json({ data: workspace, success: true });
    } catch (error) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({
        data: {
          workspace: req.workspace,
          member: req.member,
        },
        success: true,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async createWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      const workspaceModel: IWorkspace = {
        name: requestBody.name,
        email: requestBody.email,
        phone: requestBody.phone,
        default_icon: requestBody.default_icon,
        description: requestBody.description,
        logo: requestBody.logo,
        logo_full: requestBody.logo_full,
        logo_square: requestBody.logo_square,
        currency: requestBody.currency,
        time_zone: requestBody.time_zone,
        created_by: req?.user?.sub as string,
      };
      const createdWorkspace = await WorkspaceService.createWorkspace(workspaceModel);
      res.status(200).json({ success: true, data: createdWorkspace });
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async updateWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const workspaceModel: IWorkspace = req.body;
      const updatedWorkspace = await WorkspaceService.updateWorkspace(
        workspaceId as string,
        workspaceModel
      );
      res.status(200).json({ success: true, data: updatedWorkspace });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async deleteWorkspace(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      await WorkspaceService.deleteWorkspace(workspaceId as string);
      res.status(200).json({ success: true, message: "Workspace successfully deleted" });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async invite(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }
      const { workspaceId } = req.params;
      const { email, role } = req.body;
      const workspaceMember = await WorkspaceService.invite(workspaceId as string, email, role);
      res.status(200).json({ data: workspaceMember, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getAllMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const workspaceMembers = await WorkspaceService.getAllMember(workspaceId as string);
      res.status(200).json({ data: workspaceMembers, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async getMemberById(req: Request, res: Response, next: NextFunction) {
    try {
      const { memberId } = req.params;
      const member = await WorkspaceService.getMemberById(memberId as string);
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
      const { workspaceId } = req.params;
      const email = req?.user?.email as string;
      await WorkspaceService.responseInvitation(workspaceId as string, email, "accepted");
      res.status(200).json({
        success: true,
        message: "Workspace Invitation successfully accepted",
        workspaceId,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }

  public static async rejectInvitation(req: Request, res: Response, next: NextFunction) {
    try {
      const { workspaceId } = req.params;
      const email = req?.user?.email as string;
      await WorkspaceService.responseInvitation(workspaceId as string, email, "rejected");
      res
        .status(200)
        .json({ success: true, message: "Workspace Invitation successfully rejected" });
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
      };
      const member = await WorkspaceService.updateMember(memberId as string, memberModel);
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
      await WorkspaceService.deleteMember(memberId as string);
      res.status(200).json({ success: true, message: "Member successfully deleted" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        next(new HttpException(error.message, error.status));
      } else {
        next(new HttpException());
      }
    }
  }
}

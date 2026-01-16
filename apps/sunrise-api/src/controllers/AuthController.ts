import type { Request, Response, NextFunction } from "express";

import { validationResult } from "express-validator";

import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import HttpException from "../exceptions/HttpException";
import errorValidationHandler from "../utils/errorValidationHandler";

import type IUser from "../interfaces/IUser";
import type IProfile from "../interfaces/IProfile";

export default class AuthController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const { email, password } = req.body;

      const userLogin = await AuthService.login(email, password);

      return res.status(200).json({
        data: userLogin,
        success: true,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        console.error("Error during login:", error);
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }
      const requestBody = req.body;
      const userModel: IUser = {
        name: requestBody.name,
        email: requestBody.email,
        password: requestBody.password,
        email_verified: false,
      };
      const userLogin = await AuthService.signup(userModel);
      return res.status(200).json({ success: true, data: userLogin });
    } catch (error) {
      console.error("Error during signup:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async profile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.findById(req?.user?.sub as string);
      const profile: IProfile = {
        name: user.name,
        email: user.email,
        email_verified: user.email_verified,
        avatar: user.avatar || "",
        sub: user.sub || user.id,
      };
      return res.status(200).json({ data: { profile }, success: true });
    } catch (error) {
      console.error("Error during profile retrieval:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }

      const requestBody = req.body;
      const userId = req?.user?.sub as string;

      const updatedProfile = await UserService.updateUser(userId, requestBody);

      return res.status(200).json({ data: updatedProfile, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async deleteProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.sub;
      const deletedProfile = await UserService.deleteUser(userId as string);
      return res.status(200).json({ data: deletedProfile, success: true });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        res.status(422).json({ success: false, errors: errorMessages });
      }
      const requestBody = req.body;
      AuthService.sendEmailResetPassword(requestBody.email);
      return res.status(200).json({ success: true, message: "Forgot Password Email Sended!" });
    } catch (error) {
      console.error("Error during password reset request:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async newPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }
      const { token, password } = req.body;
      await AuthService.setNewPassword(token, password);
      return res.status(200).json({ success: true, message: "New Password Successfully Set!" });
    } catch (error) {
      console.error("Error during new password setting:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }
      const email = req?.user?.email;
      if (!email) {
        throw new HttpException("Invalid user", 404);
      }
      await UserService.sendEmailVerification(email);
      return res.status(200).json({ success: true, message: "Verification Email Sended!" });
    } catch (error) {
      console.error("Error during email verification request:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }

  public static async verifiedEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const validationErrors = validationResult(req).array();
      if (validationErrors.length) {
        const errorMessages = errorValidationHandler(validationErrors);
        return res.status(422).json({ success: false, errors: errorMessages });
      }
      const { token } = req.body;
      await AuthService.verifiedEmail(token);
      return res.status(200).json({ success: true, message: "Email Verified!" });
    } catch (error) {
      console.error("Error during email verification:", error);
      if (error instanceof HttpException) {
        return next(new HttpException(error.message, error.status));
      }
      return next(new HttpException());
    }
  }
}

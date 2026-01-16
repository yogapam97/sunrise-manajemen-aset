import type { Schema } from "express-validator";

import ejs from "ejs";
import path from "path";
import crypto from "crypto";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import User from "../models/User";
import ApiService from "./ApiService";
import UserService from "./UserService";
import EmailService from "./EmailService";
import UserVerifyEmail from "../models/UserVerifyEmail";
import AuthException from "../exceptions/AuthException";
import UserResetPassword from "../models/UserResetPassword";

import type IUser from "../interfaces/IUser";
import type IProfile from "../interfaces/IProfile";

interface IJsonPayload {
  sub: string;
  name: string;
  email: string;
  aud: string;
  iss: string;
  jti: string;
}
export default class AuthService extends ApiService {
  public static updateValidationSchema: Schema = {
    name: {
      exists: {
        errorMessage: "Name is required",
      },
      isString: {
        errorMessage: "Name must be a string",
      },
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "Name cannot be empty",
      },
    },
    email: {
      exists: {
        errorMessage: "Email is required",
      },
      isEmail: {
        errorMessage: "Email must be a valid email address",
      },
      normalizeEmail: true,
    },
    avatar: {
      optional: true,
    },
    phone_number: {
      optional: { options: { nullable: true } },
    },
  };

  public static loginValidationSchema: Schema = {
    email: {
      exists: { errorMessage: "Email is Required" },
      isEmail: { errorMessage: "Invalid Email" },
    },
    password: {
      exists: { errorMessage: "Password is Required" },
    },
  };

  public static signupValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
    email: {
      exists: { errorMessage: "Email is Required" },
      isEmail: { errorMessage: "Invalid Email" },
      custom: { options: UserService.checkEmailExist },
    },
    password: {
      exists: { errorMessage: "Password is Required" },
      isLength: {
        options: { min: 8 },
        errorMessage: "Password should be at least 8 characters",
      },
    },
  };

  public static verifyEmailValidationSchema: Schema = {
    email: {
      exists: { errorMessage: "Email is Required", bail: true },
      isEmail: { errorMessage: "Invalid Email", bail: true },
      custom: { options: UserService.checkEmailRegistered, bail: true },
    },
  };

  public static verifiedEmailValidationSchema: Schema = {
    token: {
      exists: { errorMessage: "Token is Required", bail: true },
      custom: { options: UserService.checkVerifyEmailToken, bail: true },
    },
  };

  public static resetPasswordValidationSchema: Schema = {
    email: {
      exists: { errorMessage: "Email is Required", bail: true },
      isEmail: { errorMessage: "Invalid Email", bail: true },
      custom: { options: UserService.checkEmailRegistered, bail: true },
    },
  };

  public static newPasswordValidationSchema: Schema = {
    token: {
      exists: { errorMessage: "Token is Required", bail: true },
      custom: { options: UserService.checkResetPasswordToken, bail: true },
    },
    password: {
      exists: { errorMessage: "Password is Required", bail: true },
      isLength: {
        options: { min: 8 },
        errorMessage: "Password must be at least 8 characters long",
        bail: true,
      },
    },
    password_confirmation: {
      exists: { errorMessage: "Password Confirmation is Required", bail: true },
      isLength: {
        options: { min: 8 },
        errorMessage: "Password Confirmation must be at least 8 characters long",
        bail: true,
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
          }
          return true;
        },
        bail: true,
      },
    },
  };

  public static async login(email: string, password: string): Promise<any> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthException();
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AuthException();
    }

    const userLogin = await AuthService.generateUserLogin(user);
    return userLogin;
  }

  public static async signup(userModel: IUser) {
    const user = await UserService.create(userModel);
    const userLogin = await AuthService.generateUserLogin(user);
    return userLogin;
  }

  public static async generateUserLogin(user: any) {
    const profile: IProfile = {
      name: user.name,
      email: user.email,
      email_verified: user.email_verified,
      avatar: user.avatar || "",
      sub: user.sub,
    };

    const tokenSecret: string = process.env.AUTH_JWT_SECRET || "";
    const refreshTokenSecret: string = process.env.AUTH_JWT_REFRESH_SECRET || "";

    const jsonPayload: IJsonPayload = {
      name: user.name,
      email: user.email,
      sub: user.sub || user.id,
      aud: "sunrise-pwa",
      iss: "sunrise-api",
      jti: uuidv4(),
    };

    const access_token: string = jwt.sign(jsonPayload, tokenSecret, {
      expiresIn: "3d",
    }); // Expires in 5 minutes

    // Generate Refresh Token
    const refresh_token: string = jwt.sign(jsonPayload, refreshTokenSecret, {
      expiresIn: "30d",
    }); // Expires in 30 days
    return {
      access_token,
      refresh_token,
      profile,
    };
  }

  public static async sendEmailResetPassword(userEmail: any) {
    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const transporter = EmailService.emailTransporter();
    const expireDate = moment().add(10, "minutes").toDate(); // 10 Minutes
    await UserService.resetPassword(userEmail, resetPasswordToken, expireDate);

    const templatePath = path.resolve(__dirname, "../views/email/reset-password/index.ejs");
    const templateData = {
      link: `${process.env.APP_HOST}/auth/new-password?token=${resetPasswordToken}`,
    };
    const renderedHTML = await ejs.renderFile(templatePath, templateData);

    const mailOptions = {
      from: process.env.EMAIL_SMTP_ACCOUNT,
      to: userEmail,
      subject: "Sunrise - Reset Password",
      html: renderedHTML,
    };
    try {
      // Send the email
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending email", error);
    }
  }

  public static async verifiedEmail(token: string) {
    const user = await UserVerifyEmail.findOneAndUpdate(
      { token, active: true, expire_at: { $gte: moment().toDate() } },
      { active: false }
    );
    if (!user) {
      throw new AuthException("Invalid or expired verify email token");
    }
    const { email } = user;
    await User.findOneAndUpdate({ email }, { email_verified: true });
  }

  public static async setNewPassword(token: string, password: string) {
    const user = await UserResetPassword.findOneAndUpdate(
      { token, active: true, expire_at: { $gte: moment().toDate() } },
      { active: false }
    );
    if (!user) {
      throw new AuthException("Invalid or expired reset password token");
    }
    const { email } = user;
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);
    const newPasswordUser = await User.findOneAndUpdate({ email }, { password: newPassword });
    if (!newPasswordUser) {
      throw new AuthException("User not found");
    }
    return true;
  }
}

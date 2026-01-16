import ejs from "ejs";
import path from "path";
import bcrypt from "bcrypt";
import moment from "moment";
import crypto from "crypto";

import User from "../models/User";
import Member from "../models/Member";
import ApiService from "./ApiService";
import FileService from "./FileService";
import EmailService from "./EmailService";
import UserVerifyEmail from "../models/UserVerifyEmail";
import HttpException from "../exceptions/HttpException";
import UserResetPassword from "../models/UserResetPassword";

import type IUser from "../interfaces/IUser";

export default class UserService extends ApiService {
  public static avatarFilePath = "avatar";

  public static async checkResetPasswordToken(token: string, { req }: any) {
    const userResetPasssword = await UserResetPassword.findOne({
      token,
      active: true,
      expire_at: { $gte: moment().toDate() },
    });
    if (userResetPasssword) {
      return true;
    }
    throw new Error("Invalid or expired reset password token");
  }

  public static async checkVerifyEmailToken(token: string, { req }: any) {
    const userVerifyEmail = await UserVerifyEmail.findOne({
      token,
      active: true,
      expire_at: { $gte: moment().toDate() },
    });
    if (userVerifyEmail) {
      return true;
    }
    throw new Error("Invalid or expired verification token");
  }

  public static async checkEmailExist(email: string) {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("User Already Exist");
    } else {
      return true;
    }
  }

  public static async checkEmailRegistered(email: string) {
    const user = await User.findOne({ email });
    if (user) {
      return true;
    }
    throw new Error("User not registered");
  }

  public static async verifyEmail(email: string, token: string, expireDate: Date) {
    const userVerifyEmailModel = {
      email,
      token,
      active: true,
      expire_at: expireDate,
    };
    await UserVerifyEmail.create(userVerifyEmailModel);
  }

  public static async resetPassword(email: string, token: string, expireDate: Date) {
    const userResetPasswordModel = {
      email,
      token,
      active: true,
      expire_at: expireDate,
    };
    await UserResetPassword.create(userResetPasswordModel);
  }

  public static async findByEmail(email: string) {
    const user = await User.findOne({ email });
    return user;
  }

  public static async findById(id: string) {
    const user = await User.findOne({ _id: id });
    return user.toJSON();
  }

  public static async create(user: IUser) {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
    const createdUser = await User.create({ ...user, password });
    await Member.updateMany({ email: user.email }, { user: createdUser._id });
    UserService.sendEmailVerification(user.email);
    return createdUser;
  }

  public static async updateUser(userId: string, userModel: any) {
    await UserService.checkIdValid(userId, "Profile");

    if (userModel.avatar !== null) {
      const avatarJWT = await FileService.extractJWTFromURL(userModel.avatar);
      const existingThumbnail = await FileService.getFileFromJWT(avatarJWT);
      if (existingThumbnail) {
        delete userModel.avatar;
      } else if (userModel.avatar) {
        const avatarURL = new URL(userModel.avatar);
        const avatarFile = avatarURL.pathname.split("/").pop();
        await FileService.moveFileToPermanentStorage(
          avatarFile as string,
          UserService.avatarFilePath
        );
        userModel.avatar = avatarFile as string;
      }
    }

    if (userModel.password) {
      const salt = await bcrypt.genSalt(10);
      userModel.password = await bcrypt.hash(userModel.password, salt);
    } else {
      delete userModel.password;
    }
    delete userModel.email;
    const updatedUser = await User.findOneAndUpdate({ _id: userId }, userModel, {
      returnOriginal: false,
    });
    if (!updatedUser) {
      throw new HttpException("User does not exist", 400);
    }
    return updatedUser;
  }

  public static async sendEmailVerification(userEmail: any) {
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const transporter = EmailService.emailTransporter();
    const expireDate = moment().add(1, "day").toDate(); // 1 day
    await UserService.verifyEmail(userEmail, verificationToken, expireDate);

    const templatePath = path.resolve(__dirname, "../views/email/verify-email/index.ejs");
    const templateData = {
      link: `${process.env.APP_HOST}/auth/verify?token=${verificationToken}`,
    };
    const renderedHTML = await ejs.renderFile(templatePath, templateData);

    const mailOptions = {
      from: process.env.EMAIL_SMTP_ACCOUNT,
      to: userEmail,
      subject: "Sunrise - Verify Email",
      html: renderedHTML,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
  }

  public static async deleteUser(userId: string): Promise<any> {
    await UserService.checkIdValid(userId, "Fixed Asset");
    const fixedAsset = await User.findOneAndDelete({ _id: userId });
    if (!fixedAsset) {
      throw new HttpException("User does not exist", 400);
    }
    return fixedAsset;
  }
}

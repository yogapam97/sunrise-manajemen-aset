import type { Schema } from "express-validator";

import ApiService from "./ApiService";
import Hashtag from "../models/Hashtag";
import HttpException from "../exceptions/HttpException";

import type IHashtag from "../interfaces/IHashtag";

export default class HashtagService extends ApiService {
  public static hashtagValidationSchema: Schema = {
    name: { exists: true, errorMessage: "Name is required" },
  };

  public static async getAll(workspace: string) {
    const hashtags = await Hashtag.find({ workspace }).sort({ updated_at: -1 });
    return hashtags;
  }

  public static async getById(hashtagId: string) {
    await HashtagService.checkIdValid(hashtagId, "Hashtag");
    const hashtag = await Hashtag.findById(hashtagId);
    if (!hashtag) {
      throw new HttpException("Hashtag does not exist", 400);
    }
    return hashtag;
  }

  public static async createHashtag(hashtagModel: IHashtag) {
    const createdHashtag = await Hashtag.create(hashtagModel);
    return createdHashtag;
  }

  public static async deleteHashtag(hashtagId: string) {
    await HashtagService.checkIdValid(hashtagId, "Hashtag");
    const hashtag = await Hashtag.findOneAndRemove({ _id: hashtagId });
    if (!hashtag) {
      throw new HttpException("Hashtag does not exist", 400);
    }
    return hashtag;
  }
}

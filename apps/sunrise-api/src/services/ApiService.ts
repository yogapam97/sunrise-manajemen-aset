import mongoose from "mongoose";

import HttpException from "../exceptions/HttpException";

export default class ApiService {
  protected static async checkIdValid(id: string, serviceName: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException(`Invalid ${serviceName} ID`, 400);
    }
    return true;
  }
}

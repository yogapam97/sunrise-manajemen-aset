import type { Document } from "mongoose";

import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import FileService from "../services/FileService";

// Define the Workspace Data shape
interface WorkspaceData {
  name: string;
  email: string;
  phone: string;
  default_icon: string;
  description: string;
  logo_full: string;
  logo_square: string;
  logo: string;
  currency: Schema.Types.Mixed;
  time_zone: Schema.Types.Mixed;
  created_by: Schema.Types.ObjectId; // reference to User model
}

export const WorkspaceSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    default_icon: String,
    description: String,
    logo_full: String,
    logo_square: String,
    logo: String,
    currency: Schema.Types.Mixed,
    time_zone: Schema.Types.Mixed,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

WorkspaceSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    if (ret.logo) {
      ret.logo = FileService.generateJWTForFile(FileService.logoFilePath, ret.logo);
    }
    return ret;
  },
});

WorkspaceSchema.plugin(mongoosePaginate);

// Define the mongoose document interface
interface WorkspaceDocument extends WorkspaceData, Document {}

// create the paginated model
const WorkspaceModel = mongoose.model<WorkspaceDocument, mongoose.PaginateModel<WorkspaceDocument>>(
  "Workspace",
  WorkspaceSchema
);

export default WorkspaceModel;

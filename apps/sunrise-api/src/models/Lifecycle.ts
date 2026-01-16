import type { Document } from "mongoose";

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import Workspace from "./Workspace";

interface LifecycleData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  color: string;
  code: string;
  is_maintenance_cycle: boolean;
  description: string;
}

export const LifecycleSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    color: String,
    code: String,
    is_maintenance_cycle: Boolean,
    description: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

LifecycleSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

LifecycleSchema.plugin(mongoosePaginate);
interface LifecycleDocument extends LifecycleData, Document {}
// create the paginated model
const LifecycleModel = mongoose.model<LifecycleDocument, mongoose.PaginateModel<LifecycleDocument>>(
  "Lifecycle",
  LifecycleSchema
);

export default LifecycleModel;

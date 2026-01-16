import type { Document, PaginateModel, AggregatePaginateModel } from "mongoose";

import mongoose, { model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

import Workspace from "./Workspace";
import { CheckSchema } from "./Check";
import FileService from "../services/FileService";
import { MaintenanceSchema } from "./Maintenance";

interface FixedAssetData {
  workspace: any;
  name: string;
  code: string;
  serial_number: string;
  type: "tangible" | "intangible";
  description: string;
  metric: mongoose.Schema.Types.ObjectId;
  location: mongoose.Schema.Types.ObjectId;
  lifecycle: mongoose.Schema.Types.ObjectId;
  category: mongoose.Schema.Types.ObjectId;
  assignee: mongoose.Schema.Types.ObjectId;
  tags: string[];
  images: string[];
  thumbnail: string;
  is_calculate_depreciation: boolean;
  purchase_date: Date;
  purchase_cost: number;
  active_start_date: Date;
  active_end_date: Date;
  warranty_expire_date: Date;
  additional_fields: any[];
  current_check: any;
  current_maintenance: any;
  created_by: mongoose.Schema.Types.ObjectId;
}

export const FixedAssetSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    code: String,
    serial_number: String,
    type: {
      type: String,
      enum: ["tangible", "intangible"],
    },
    description: String,
    metric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metric",
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    lifecycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lifecycle",
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    tags: [String],
    images: [
      {
        type: String,
      },
    ],
    thumbnail: String,
    is_calculate_depreciation: Boolean,
    purchase_date: Date,
    purchase_cost: Number,
    active_start_date: Date,
    active_end_date: Date,
    warranty_expire_date: Date,
    current_check: CheckSchema,
    current_maintenance: MaintenanceSchema,
    additional_fields: [mongoose.Schema.Types.Mixed],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

FixedAssetSchema.set("toJSON", {
  virtuals: true,
  transform(doc: any, ret: any) {
    delete ret._id;
    delete ret.__v;
    if (ret.thumbnail) {
      ret.thumbnail = FileService.generateJWTForFile(FileService.thumbnailFilePath, ret.thumbnail);
    }
    if (ret.images?.length > 0) {
      ret.images = ret.images.map((image: string) =>
        FileService.generateJWTForFile(FileService.imagesFilePath, image)
      );
    }
    return ret;
  },
});

FixedAssetSchema.plugin(mongoosePaginate);
FixedAssetSchema.plugin(aggregatePaginate);
interface FixedAssetDocument extends FixedAssetData, Document {}
// Extend the Mongoose types to include both paginate and aggregatePaginate
type CustomModel<T extends Document> = PaginateModel<T> & AggregatePaginateModel<T>;
// create the paginated model
const FixedAsset = model<FixedAssetDocument, CustomModel<FixedAssetDocument>>(
  "FixedAsset",
  FixedAssetSchema,
  "fixed_assets"
);
export default FixedAsset;
// export default mongoose.models.FixedAsset || mongoose.model("FixedAsset", FixedAssetSchema, "fixed_assets");

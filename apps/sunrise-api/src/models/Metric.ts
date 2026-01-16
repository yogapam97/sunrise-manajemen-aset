import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import Member from "./Member";
import Workspace from "./Workspace";

interface MetricData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  type: "numerical" | "categorical";
  min: Number;
  max: Number;
  default: any;
  labels: [{ label: string; color: string }];
  description: string;
  created_by: mongoose.Schema.Types.ObjectId;
}

const MetricSchema = new mongoose.Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    type: {
      type: String,
      enum: ["numerical", "categorical"],
      default: "numerical",
    },
    min: Number,
    max: Number,
    default: Schema.Types.Mixed,
    labels: [{ label: String, color: String }],
    description: String,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: Member,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

MetricSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

MetricSchema.plugin(mongoosePaginate);
interface MetricDocument extends MetricData, Document {}
// create the paginated model
const Metric = mongoose.model<MetricDocument, mongoose.PaginateModel<MetricDocument>>(
  "Metric",
  MetricSchema
);

export default Metric;

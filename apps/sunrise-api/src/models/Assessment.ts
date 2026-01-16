import mongoose, { Schema } from "mongoose";

import Metric from "./Metric";
import Member from "./Member";
import Workspace from "./Workspace";
import FixedAsset from "./FixedAsset";

const AssessmentSchema = new mongoose.Schema(
  {
    workspace: {
      type: Schema.Types.ObjectId,
      ref: Workspace,
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: FixedAsset,
    },
    metric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Metric,
    },
    assessed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Member,
    },
    value: Schema.Types.Mixed,
    note: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

AssessmentSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

export default mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);

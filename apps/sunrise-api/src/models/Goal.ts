import mongoose from "mongoose";

import Metric from "./Metric";
import Member from "./Member";
import Workspace from "./Workspace";

const GoalSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    metric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Metric,
    },
    expire_date: Date,
    aggregate: String,
    label_target: String,
    target: Number,
    description: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
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

GoalSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

export default mongoose.models.Goal || mongoose.model("Goal", GoalSchema);

import mongoose from "mongoose";

import Member from "./Member";
import Workspace from "./Workspace";

const LabelDesignSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    description: String,
    labelType: String,
    left: Number,
    top: Number,
    leftContent: Number,
    topContent: Number,
    barcodeHeight: Number,
    barcodeWidth: Number,
    labelWidth: Number,
    labelHeight: Number,
    qrSize: Number,
    marginLeft: Number,
    marginTop: Number,
    marginRight: Number,
    marginBottom: Number,
    withBorder: Boolean,
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

LabelDesignSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

export default mongoose.models.Label || mongoose.model("Label", LabelDesignSchema);

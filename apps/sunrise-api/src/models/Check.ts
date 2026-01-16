import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { MemberSchema } from "./Member";
import { LocationSchema } from "./Location";

interface CheckData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  status: "check-in" | "check-out";
  check_as: string;
  is_assignment: boolean;
  is_relocation: boolean;
  check_in_date: Date;
  check_due_date: Date;
  check_out_date: Date;
  checked_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}
export const CheckSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    status: {
      type: String,
      enum: ["check-in", "check-out"],
    },
    location: LocationSchema,
    is_relocation: Boolean,
    assignee: MemberSchema,
    is_assignment: Boolean,
    check_in_date: Date,
    check_due_date: Date,
    check_out_date: Date,
    checked_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    note: String,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

CheckSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

CheckSchema.plugin(mongoosePaginate);
interface CheckDocument extends CheckData, Document {}
// create the paginated model
const Check = mongoose.model<CheckDocument, mongoose.PaginateModel<CheckDocument>>(
  "Check",
  CheckSchema
);

export default Check;

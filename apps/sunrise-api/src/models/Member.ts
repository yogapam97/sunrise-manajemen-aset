import type { PaginateModel, AggregatePaginateModel } from "mongoose";

import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// Define the Member Data shape
interface MemberData {
  workspace: Schema.Types.ObjectId; // reference to Workspace model
  user: Schema.Types.ObjectId | any; // reference to User model
  code: string;
  invitation_status: "pending" | "accepted" | "rejected" | "mastered";
  email: string;
  role: string;
  admin_permissions: Schema.Types.Mixed[];
}

export const MemberSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: String,
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    invitation_status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "mastered"],
      default: "pending",
    },
    email: String,
    role: String,
    admin_permissions: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// MemberSchema.virtual("user", {
//   ref: "User",
//   localField: "email",
//   foreignField: "email",
//   justOne: true,
// });

MemberSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

MemberSchema.plugin(mongoosePaginate);
MemberSchema.plugin(aggregatePaginate);

// create the paginated model
const MemberModel = mongoose.model<
  MemberData,
  AggregatePaginateModel<MemberData> & PaginateModel<MemberData>
>("Member", MemberSchema);

export default MemberModel;

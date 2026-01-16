import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface AssignmentData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  old_assignee: mongoose.Schema.Types.ObjectId | any;
  new_assignee: mongoose.Schema.Types.ObjectId | any;
  assigned_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}

const AssignmentSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    old_assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    new_assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    assigned_by: {
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

AssignmentSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

AssignmentSchema.plugin(mongoosePaginate);
interface AssignmentDocument extends AssignmentData, Document {}
// create the paginated model
const AssignmentModel = mongoose.model<
  AssignmentDocument,
  mongoose.PaginateModel<AssignmentDocument>
>("Assignment", AssignmentSchema);

export default AssignmentModel;

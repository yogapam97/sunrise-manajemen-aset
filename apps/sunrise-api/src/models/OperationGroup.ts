import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface OperationGroupData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  code: string;
  is_audit: boolean;
  is_assignment: boolean;
  is_relocation: boolean;
  is_transition: boolean;
  description: string;
  created_by: string;
  created_by_system: boolean;
  created_at: Date;
  updated_at: Date;
}

const OperationGroupSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    name: String,
    code: String,
    is_audit: Boolean,
    is_assignment: Boolean,
    is_relocation: Boolean,
    is_transition: Boolean,
    description: String,
    created_by: String,
    created_by_system: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

OperationGroupSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

OperationGroupSchema.plugin(mongoosePaginate);
interface OperationGroupDocument extends OperationGroupData, Document {}
// create the paginated model
const OperationGroupModel = mongoose.model<
  OperationGroupDocument,
  mongoose.PaginateModel<OperationGroupDocument>
>("Operation_Group", OperationGroupSchema);

export default OperationGroupModel;

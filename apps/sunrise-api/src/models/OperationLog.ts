import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface OperationLogData {
  workspace: mongoose.Schema.Types.ObjectId;
  operation_group: mongoose.Schema.Types.Mixed;
  operation_key: string;
  operation_id: string;
  operation_type: string;
  operation_object: string;
  operation_subject: mongoose.Schema.Types.ObjectId | any;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  details: any;
  note: string;
  created_at: Date;
}

const OperationLogSchema = new mongoose.Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
  },
  operation_group: mongoose.Schema.Types.Mixed,
  operation_key: String,
  operation_id: String,
  operation_type: String,
  operation_object: {
    type: String,
    default: "FIXED_ASSET",
  },
  fixed_asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FixedAsset",
  },
  details: mongoose.Schema.Types.Mixed,
  operation_subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  note: String,
  created_at: { type: Date, default: Date.now },
});

OperationLogSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

OperationLogSchema.plugin(mongoosePaginate);
interface OperationLogDocument extends OperationLogData, Document {}
// create the paginated model
const OperationLogModel = mongoose.model<
  OperationLogDocument,
  mongoose.PaginateModel<OperationLogDocument>
>("Operation_Log", OperationLogSchema);

export default OperationLogModel;

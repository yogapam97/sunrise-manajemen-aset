import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface AuditData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  metric: mongoose.Schema.Types.ObjectId | any;
  value: mongoose.Schema.Types.Mixed | any;
  audited_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}
const AuditSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    metric: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Metric",
    },
    value: mongoose.Schema.Types.Mixed,
    audited_by: {
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

AuditSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

AuditSchema.plugin(mongoosePaginate);
interface AuditDocument extends AuditData, Document {}
// create the paginated model
const Audit = mongoose.model<AuditDocument, mongoose.PaginateModel<AuditDocument>>(
  "Audit",
  AuditSchema
);

export default Audit;

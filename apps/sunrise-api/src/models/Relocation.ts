import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface RelocationData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  old_location: mongoose.Schema.Types.ObjectId | any;
  new_location: mongoose.Schema.Types.ObjectId | any;
  relocated_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}

const RelocationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    old_location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    new_location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
    relocated_by: {
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

RelocationSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

RelocationSchema.plugin(mongoosePaginate);
interface RelocationDocument extends RelocationData, Document {}
// create the paginated model
const RelocationModel = mongoose.model<
  RelocationDocument,
  mongoose.PaginateModel<RelocationDocument>
>("Relocation", RelocationSchema);

export default RelocationModel;

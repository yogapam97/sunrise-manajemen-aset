import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface TransitionData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  old_lifecycle: mongoose.Schema.Types.ObjectId | any;
  new_lifecycle: mongoose.Schema.Types.ObjectId | any;
  transitioned_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}
const TransitionSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    old_lifecycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lifecycle",
    },
    new_lifecycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lifecycle",
    },
    transitioned_by: {
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

TransitionSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

TransitionSchema.plugin(mongoosePaginate);
interface TransitionDocument extends TransitionData, Document {}
// create the paginated model
const TransitionModel = mongoose.model<
  TransitionDocument,
  mongoose.PaginateModel<TransitionDocument>
>("Transition", TransitionSchema);

export default TransitionModel;

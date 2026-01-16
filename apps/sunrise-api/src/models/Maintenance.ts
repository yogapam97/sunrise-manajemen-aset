import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import { LifecycleSchema } from "./Lifecycle";

interface MaintenanceData {
  workspace: mongoose.Schema.Types.ObjectId;
  fixed_asset: mongoose.Schema.Types.ObjectId | any;
  is_transition: boolean;
  lifecycle: any;
  maintenance_cost: number;
  maintenance_date: Date;
  maintenance_next_date: Date;
  checked_by: mongoose.Schema.Types.ObjectId | any;
  note: string;
}
export const MaintenanceSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    fixed_asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FixedAsset",
    },
    is_transition: Boolean,
    lifecycle: LifecycleSchema,
    maintenance_cost: Number,
    maintenance_date: Date,
    maintenance_next_date: Date,
    maintained_by: {
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

MaintenanceSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.workspace;
  },
});

MaintenanceSchema.plugin(mongoosePaginate);
interface MaintenanceDocument extends MaintenanceData, Document {}
// create the paginated model
const Maintenance = mongoose.model<
  MaintenanceDocument,
  mongoose.PaginateModel<MaintenanceDocument>
>("Maintenance", MaintenanceSchema);

export default Maintenance;

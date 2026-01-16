import type { Document } from "mongoose";

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import Member from "./Member";
import Workspace from "./Workspace";

interface SupplierData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  code: string;
  email: string;
  phone: string;
  url: string;
  address: string;
  description: string;
  created_by: mongoose.Schema.Types.ObjectId;
}

const SupplierSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    code: String,
    email: String,
    phone: String,
    url: String,
    address: String,
    description: String,
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

SupplierSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

SupplierSchema.plugin(mongoosePaginate);
interface SupplierDocument extends SupplierData, Document {}
// create the paginated model
const SupplierModel = mongoose.model<SupplierDocument, mongoose.PaginateModel<SupplierDocument>>(
  "Supplier",
  SupplierSchema
);

export default SupplierModel;

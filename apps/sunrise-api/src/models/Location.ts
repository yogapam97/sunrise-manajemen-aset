import type { Document } from "mongoose";

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import Member from "./Member";
import Workspace from "./Workspace";

interface LocationData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  code: string;
  address: string;
  description: string;
  created_by: mongoose.Schema.Types.ObjectId;
}

export const LocationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    code: String,
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

LocationSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

LocationSchema.plugin(mongoosePaginate);
interface LocationDocument extends LocationData, Document {}
// create the paginated model
const LocationModel = mongoose.model<LocationDocument, mongoose.PaginateModel<LocationDocument>>(
  "Location",
  LocationSchema
);

export default LocationModel;

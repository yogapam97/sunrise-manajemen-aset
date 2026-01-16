import type { Document } from "mongoose";

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

import Member from "./Member";
import Workspace from "./Workspace";

interface CategoryData {
  workspace: mongoose.Schema.Types.ObjectId;
  name: string;
  code: string;
  icon: string;
  description: string;
  created_by: mongoose.Schema.Types.ObjectId;
}

const CategorySchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Workspace,
    },
    name: String,
    code: String,
    icon: String,
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

CategorySchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

CategorySchema.plugin(mongoosePaginate);
interface CategoryDocument extends CategoryData, Document {}
// create the paginated model
const CategoryModel = mongoose.model<CategoryDocument, mongoose.PaginateModel<CategoryDocument>>(
  "Category",
  CategorySchema
);

export default CategoryModel;

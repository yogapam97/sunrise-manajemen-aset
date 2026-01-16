import mongoose from "mongoose";

import FileService from "../services/FileService";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    sub: mongoose.Schema.Types.ObjectId,
    username: String,
    email: String,
    phone_number: String,
    avatar: String,
    password: String,
    email_verified: Boolean,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

UserSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    if (ret.avatar) {
      ret.avatar = FileService.generateJWTForFile(FileService.avatarFilePath, ret.avatar);
    }

    return ret;
  },
});

UserSchema.pre("save", function save(next) {
  if (this.isNew) {
    // this refers to the document
    this.sub = this._id;
  }
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;

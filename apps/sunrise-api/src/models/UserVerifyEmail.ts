import mongoose from "mongoose";

const UserVerifyEmailSchema = new mongoose.Schema(
  {
    email: String,
    token: String,
    active: Boolean,
    expire_at: Date,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

UserVerifyEmailSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.UserVerifyEmail ||
  mongoose.model("UserVerifyEmail", UserVerifyEmailSchema, "user_verify_emails");

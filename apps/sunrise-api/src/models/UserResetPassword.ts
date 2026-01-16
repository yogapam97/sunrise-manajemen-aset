import mongoose from "mongoose";

const UserResetPasswordSchema = new mongoose.Schema(
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

UserResetPasswordSchema.set("toJSON", {
  virtuals: true,
  transform(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.models.UserResetPassword ||
  mongoose.model("UserResetPassword", UserResetPasswordSchema, "user_reset_passwords");

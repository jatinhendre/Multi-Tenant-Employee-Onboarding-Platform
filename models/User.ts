import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "SUPERADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["SUPERADMIN", "COMPANY_ADMIN", "EMPLOYEE"],
    required: true,
  },
});

export const User =
  models.User || mongoose.model<IUser>("User", UserSchema);

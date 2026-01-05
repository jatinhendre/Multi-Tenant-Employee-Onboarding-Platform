import mongoose, { Schema, Document, models, ObjectId } from "mongoose";

export interface ICompany extends Document {
  id: ObjectId;
  name: string;
  dbName: string;
  adminEmail: string;
  status: "ACTIVE" | "DISABLED";
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  dbName: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },
});

export const Company =
  models.Company || mongoose.model<ICompany>("Company", CompanySchema);

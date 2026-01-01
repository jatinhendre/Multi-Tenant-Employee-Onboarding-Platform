import mongoose, { Schema, Document, models } from "mongoose";

export interface ICompany extends Document {
  name: string;
  dbName: string;
  adminEmail: string;
  adminPassword: string;
  status: "ACTIVE" | "DISABLED";
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  dbName: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true },
  adminPassword:{type:String,  required:true},
  status: { type: String, enum: ["ACTIVE", "DISABLED"], default: "ACTIVE" },
});

export const Company =
  models.Company || mongoose.model<ICompany>("Company", CompanySchema);

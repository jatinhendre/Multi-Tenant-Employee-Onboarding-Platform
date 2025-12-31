import mongoose, { Schema, Document, models } from "mongoose";

export interface IPendingCompany extends Document {
  companyName: string;
  companySize: number;
  adminEmail: string;
  adminPassword: string;
  contactEmail: string;
  requirements: string[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
}

const PendingCompanySchema = new Schema<IPendingCompany>({
  companyName: { type: String, required: true },
  companySize: { type: Number, required: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  contactEmail: { type: String, required: true },
  requirements: [{ type: String }],
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});

export const PendingCompany =
  models.PendingCompany ||
  mongoose.model<IPendingCompany>("PendingCompany", PendingCompanySchema);

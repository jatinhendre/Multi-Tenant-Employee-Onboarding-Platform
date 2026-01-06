import { Connection, Schema, Model } from "mongoose";

export interface IEmployee {
  name: string;
  email: string;
  password:string;
  role:"EMPLOYEE";
  position: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
}

export const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add this
  position: { type: String },
  role: { type: String, default: "EMPLOYEE" },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  createdAt: { type: Date, default: Date.now },
});

// Helper to get model from a tenant connection
export function getEmployeeModel(conn: Connection): Model<IEmployee> {
  return conn.models.Employee || conn.model<IEmployee>("Employee", EmployeeSchema);
}

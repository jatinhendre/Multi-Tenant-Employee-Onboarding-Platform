import { Connection, Schema, Model } from "mongoose";

export interface IEmployee {
  name: string;
  email: string;
  position: "HEAD" | "EMPLOYEE" | "COHEAD" | "HR" | "MANAGER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
}

export const EmployeeSchema = new Schema<IEmployee>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  createdAt: { type: Date, default: Date.now },
});

// Helper to get model from a tenant connection
export function getEmployeeModel(conn: Connection): Model<IEmployee> {
  return conn.models.Employee || conn.model<IEmployee>("Employee", EmployeeSchema);
}

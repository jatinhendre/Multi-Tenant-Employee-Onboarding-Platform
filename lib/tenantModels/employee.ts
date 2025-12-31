import mongoose, { Connection, Schema, Model, Document } from "mongoose";

export interface EmployeeDoc extends Document {
  name: string;
  email: string;
}

const employeeSchema = new Schema<EmployeeDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export function getEmployeeModel(conn: Connection): Model<EmployeeDoc> {
  return (
    (conn.models.Employee as Model<EmployeeDoc>) ||
    conn.model<EmployeeDoc>("Employee", employeeSchema)
  );
}

import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import { connectTenantDB } from "../../../../../lib/tenantDB";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const db = searchParams.get("db");

  if (!db) {
    return NextResponse.json({ employees: [] });
  }

  const conn = await connectTenantDB(db);
  const Employee = getEmployeeModel(conn);

  const employees = await Employee.find().lean();

  return NextResponse.json({ employees });
}

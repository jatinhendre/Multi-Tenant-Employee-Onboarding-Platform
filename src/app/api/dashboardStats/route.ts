import { NextResponse } from "next/server";
import { connectTenantDB } from "../../../../lib/tenantDB";
import { getEmployeeModel } from "../../../../models/tenant/Employee";
import { getTaskModel } from "../../../../models/tenant/task";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const db = searchParams.get("db");

  if (!db) return NextResponse.json({ message: "No DB provided" }, { status: 400 });

  try {
    const conn = await connectTenantDB(db);
    const Employee = getEmployeeModel(conn);
    const Task = getTaskModel(conn);

    // ✅ Performance Optimization: Saari queries parallel mein chalengi
    const [empCount, pendingCount, completedCount] = await Promise.all([
      Employee.countDocuments({ status: "ACTIVE" }),
      Task.countDocuments({ status: { $ne: "COMPLETED" } }),
      Task.countDocuments({ status: "COMPLETED" })
    ]);

    return NextResponse.json({
      activeEmployees: empCount,
      tasksPending: pendingCount,
      projectsDone: completedCount,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ message: "Error fetching stats" }, { status: 500 });
  }
}
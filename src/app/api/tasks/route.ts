import { NextResponse } from "next/server";
import { getTaskModel } from "../../../../models/tenant/task";
import { connectTenantDB } from "../../../../lib/tenantDB";
export async function POST(req: Request) {
  try {
    // 1. Get data from frontend
    const { id, status, companyDb } = await req.json();

    if (!id || !status || !companyDb) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 2. Connect to the specific Tenant Database
    const conn = await connectTenantDB(companyDb);
    const Task = getTaskModel(conn);

    // 3. Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: status },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated", task: updatedTask });
  } catch (error) {
    console.error("Update status error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
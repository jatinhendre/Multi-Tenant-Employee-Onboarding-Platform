import { NextResponse } from "next/server";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import { getTaskModel } from "../../../../../models/tenant/task";

export async function POST(req: Request) {
  const { title, description, assignedTo, dueDate, companyDb } =
    await req.json();

  if (!title || !assignedTo || !companyDb) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const conn = await connectTenantDB(companyDb);

  const Employee = getEmployeeModel(conn);
  const userExists = await Employee.findOne({ email: assignedTo });

  if (!userExists) {
    return NextResponse.json(
      { message: "Employee not found" },
      { status: 404 }
    );
  }

  const Task = getTaskModel(conn);

  await Task.create({
    title,
    description,
    assignedTo,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  });

  return NextResponse.json({ message: "Task created 🎉" }, { status: 201 });
}

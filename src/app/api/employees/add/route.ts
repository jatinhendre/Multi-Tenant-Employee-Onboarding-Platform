import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { getEmployeeModel } from "../../../../../models/tenant/Employee";
import { User } from "../../../../../models/User";
import { Company } from "../../../../../models/Company";

export async function POST(req: Request) {
  await connectDB();

  const { email, companyDb, name, position } = await req.json();

  if (!email || !companyDb || !name || !position) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }
  const company = await Company.findOne({ dbName: companyDb });
  if(!company){
    return NextResponse.json({message:"Company not found"},{status:404})
  }
  // connect to tenant DB
  const tenantConn = await connectTenantDB(companyDb);
  if(!tenantConn){
    return NextResponse.json({message:"failed"},{status:400})
  }
  const Employee = getEmployeeModel(tenantConn);

  await Employee.create({
    name,
    email,
    position,
  });
  await User.create({
  email,
  password:"employee123",
  role: "EMPLOYEE",
  company: company._id
});
  return NextResponse.json({ message: "Employee added" }, { status: 201 });
}

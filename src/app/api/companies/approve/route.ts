import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { PendingCompany } from "../../../../../models/PendingCompany";
import { Company } from "../../../../../models/Company";
import { connectTenantDB } from "../../../../../lib/tenantDB";
import { User } from "../../../../../models/User";
import { getEmployeeModel } from "../../../../../lib/tenantModels/employee";
import { sendApprovalEmail } from "../../../../../lib/email";

export async function POST(req: Request) {
  await connectDB();

  const form = await req.formData();
  const id = form.get("id")?.toString();

  if (!id) {
    return NextResponse.json({ message: "Missing id" }, { status: 400 });
  }

  const pending = await PendingCompany.findById(id);

  if (!pending) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  
  const safe = pending.companyName
  .toLowerCase()
  .replace(/\s+/g, "_")
  .replace(/[^a-z0-9_]/g, "")
  .replace(/^_+|_+$/g, "")
  .slice(0, 50);

  const dbName = `company_${safe}_${pending._id.toString().slice(-5)}`;

  // 2️⃣ Save company metadata in platform DB
  let company = await Company.findOne({ dbName });

if (!company) {
  company = await Company.create({
    name: pending.companyName,
    dbName,
    adminEmail: pending.adminEmail,
  });
}


  // 3️⃣ Create dedicated company DB
  const tenantDB = await connectTenantDB(dbName);
    // --- Create Employee model for tenant DB ---
const Employee = getEmployeeModel(tenantDB);

// --- Insert first employee (so DB gets created) ---
await Employee.create({
  name: "Admin",
  email: pending.adminEmail,
});

  // 4️⃣ Create admin user in platform DB
  let admin = await User.findOne({ email: pending.adminEmail });

if (!admin) {
  admin = await User.create({
    email: pending.adminEmail,
    password: pending.adminPassword,
    role: "COMPANY_ADMIN",
  });
}


  // 5️⃣ (Optional now) mark pending as approved
  pending.status = "APPROVED";
  await pending.save();
  await sendApprovalEmail(
  pending.contactEmail,
  pending.companyName
);


  return NextResponse.redirect(new URL("/superadmin", req.url));
}

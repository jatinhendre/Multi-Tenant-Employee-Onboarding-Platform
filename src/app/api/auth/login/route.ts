import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";
import { Company } from "../../../../../models/Company";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
  let company = null;

  if (user.role === "COMPANY_ADMIN") {
    company = await Company.findOne({ adminEmail: email }).lean();
  }
  return NextResponse.json({
    message: "Login success",
    role: user.role,
    company
  });
}

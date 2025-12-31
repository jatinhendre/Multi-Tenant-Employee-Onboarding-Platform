import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";

export async function GET() {
  await connectDB();

  const email = "superadmin@saas.com";
  const password = "admin123"; // later: hash it

  const exists = await User.findOne({ email });

  if (exists) {
    return NextResponse.json({ message: "Already created" });
  }

  await User.create({
    email,
    password,
    role: "SUPERADMIN",
  });

  return NextResponse.json({
    message: "Super admin created",
    login: { email, password },
  });
}

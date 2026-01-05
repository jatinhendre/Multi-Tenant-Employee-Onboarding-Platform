import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { PendingCompany } from "../../../../../models/PendingCompany";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      companyName,
      companySize,
      adminEmail,
      adminPassword,
      contactEmail,
      requirements,
    } = body;

    if (
      !companyName ||
      !companySize ||
      !adminEmail ||
      !adminPassword ||
      !contactEmail
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const hashed = await bcrypt.hash(adminPassword, 10);
    const company = await PendingCompany.create({
      companyName,
      companySize,
      adminEmail,
      adminPassword:hashed,
      contactEmail,
      requirements,
    });

    return NextResponse.json(
      { message: "Request submitted for approval", company },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

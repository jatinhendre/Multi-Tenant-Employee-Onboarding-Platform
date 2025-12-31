import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { PendingCompany } from "../../../../../models/PendingCompany";

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

    const company = await PendingCompany.create({
      companyName,
      companySize,
      adminEmail,
      adminPassword,
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

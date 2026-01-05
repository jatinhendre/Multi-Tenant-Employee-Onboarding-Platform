import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../models/User";
import { Company, ICompany } from "../../../../../models/Company";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../../../../lib/token";

export async function POST(req: Request) {
  await connectDB();

  const { email, password }: { email: string; password: string } = await req.json();

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  let company: ICompany | null = null;

  if (user.role === "COMPANY_ADMIN") {
    company = await Company.findOne({ adminEmail: email }).lean<ICompany>();
  }

  if (user.role === "EMPLOYEE") {
    company = await Company.findById(user.company).lean<ICompany>();
  }

  if(user.role !== "SUPERADMIN"){
    if (!company) {
    return NextResponse.json(
      { message: "Company not found" },
      { status: 404 }
    );
  }
  }

  const accessToken = generateAccessToken({
    email: user.email,
    role: user.role,
    companyID: company?._id.toString()
  });

  const refreshToken = generateRefreshToken({
    email: user.email,
    role: user.role,
    companyID: company?._id.toString()
  });

  const res = NextResponse.json({
    message: "Login success",
    role: user.role,
    company
  });

  res.cookies.set("accessToken", accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production"
  });

  res.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  });

  return res;
}

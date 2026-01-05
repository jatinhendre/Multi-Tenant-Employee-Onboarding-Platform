import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "./db";
import { User } from "../models/User";
import { Company,ICompany } from "../models/Company";
import { JWTPayload } from "../types/auth";
interface IUser {
  _id: string; // lean() returns _id as an object usually, but we will handle it
  email: string;
  role: "COMPANY_ADMIN" | "SUPERADMIN" | "EMPLOYEE";
  company?: string; // or ObjectId
}
const ACCESS_SECRET = process.env.JWT_SECRET!;

export async function getSessionData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { user: null, company: null };

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JWTPayload;
    
    await connectDB();
    
    // 1. Fetch User
    // We use .lean() for better performance as we just need a plain JS object
    const user = await User.findOne({ email: decoded.email }).select("-password").lean<IUser>();

    if (!user) return { user: null, company: null };

    // 2. Fetch Company based on Role (Matching your Login API logic)
    let company : ICompany | null= null;

    if (user.role === "COMPANY_ADMIN") {
      company = (await Company.findOne({ adminEmail: user.email }).lean()) as ICompany | null;
    } 
    else if (user.role === "EMPLOYEE" && user.company) {
      company = (await Company.findById(user.company).lean()) as ICompany | null;
    }
    // SUPERADMIN might not have a specific company attached, or follows different logic

    // 3. Serialize Data (Next.js warns if you pass complex DB objects directly)
    // Convert _id to string to avoid serialization warnings
    const serializedUser = {
        ...user,
        _id: user._id.toString(),
        company: user.company ? user.company.toString() : null
    };

    const serializedCompany = company ? {
        ...company,
        _id: company._id.toString(),
    } : null;

    return { user: serializedUser, company: serializedCompany };

  } catch (error) {
    console.error("Session verification failed", error);
    return { user: null, company: null };
  }
}
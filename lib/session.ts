import { cookies } from "next/headers";
import { verifyAccessToken } from "./token";
import { connectDB } from "./db";
import { User } from "../models/User";
import { Company } from "../models/Company";
import { connectTenantDB } from "./tenantDB";
import { getEmployeeModel } from "../models/tenant/Employee";
import { JWTPayload } from "./JWTPayload";

interface ISystemUser {
  _id: string;
  email: string;
  role: string;
  company?: string;
}

interface ISessionUser {
  _id: string;
  email: string;
  role: string;
  name?: string;
}

interface ISessionCompany {
  _id: string;
  name: string;
  dbName: string;
}

interface SessionResponse {
  user: ISessionUser | null;
  company: ISessionCompany | null;
}

export async function getSessionData(): Promise<SessionResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return { user: null, company: null };

  try {
    const decoded = verifyAccessToken(token) as JWTPayload | null;
    if (!decoded) return { user: null, company: null };

    await connectDB();

    if (decoded.role === "SUPERADMIN" || decoded.role === "COMPANY_ADMIN") {
      const user = (await User.findOne({ email: decoded.email }).lean()) as ISystemUser | null;
      
      if (!user) return { user: null, company: null };

      const companyMetadata = user.company 
        ? (await Company.findById(user.company).lean()) as ISessionCompany | null
        : null;
      
      return { 
        user: JSON.parse(JSON.stringify(user)) as ISessionUser, 
        company: JSON.parse(JSON.stringify(companyMetadata)) 
      };
    }

    if (decoded.role === "EMPLOYEE") {
      if (!decoded.dbName) return { user: null, company: null };

      const tenantConn = await connectTenantDB(decoded.dbName);
      const EmployeeModel = getEmployeeModel(tenantConn);
      const employee = await EmployeeModel.findOne({ email: decoded.email }).lean();

      const companyContext = (await Company.findOne({ dbName: decoded.dbName }).lean()) as ISessionCompany | null;

      if (!employee) return { user: null, company: null };

      return {
        user: JSON.parse(JSON.stringify({ ...employee, role: "EMPLOYEE" })) as ISessionUser,
        company: JSON.parse(JSON.stringify(companyContext))
      };
    }

    return { user: null, company: null };
  } catch (error) {
    return { user: null, company: null };
  }
}
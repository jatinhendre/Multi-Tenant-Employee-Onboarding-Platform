export interface JWTPayload {
  userId: string;
  email: string;
  role: "SUPERADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  company?: string | null;
}

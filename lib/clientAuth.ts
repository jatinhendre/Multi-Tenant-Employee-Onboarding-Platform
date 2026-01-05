import { jwtDecode } from "jwt-decode";

export interface JWTPayload {
  userId: string;
  email: string;
  role: "SUPERADMIN" | "COMPANY_ADMIN" | "EMPLOYEE";
  company?: string;
  exp: number;
}

export function getUserFromToken(): JWTPayload | null {
  if (typeof document === "undefined") return null;

  const cookie = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith("accessToken="));

  if (!cookie) return null;

  const token = cookie.split("=")[1];

  try {
    const res = jwtDecode<JWTPayload>(token);
    console.log(res);
    return res;
  } catch {
    return null;
  }
}

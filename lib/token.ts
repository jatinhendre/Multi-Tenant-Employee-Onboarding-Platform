import jwt from "jsonwebtoken";
import { JWTPayload } from "./JWTPayload"; // Ensure this interface has email, role, and dbName

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
}

// Return type ko JWTPayload | null rakhte hain for strict checking
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, ACCESS_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}
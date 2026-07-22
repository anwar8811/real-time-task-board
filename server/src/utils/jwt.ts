import "dotenv/config";
import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/client";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined in environment variables`);
  }
  return value;
}

const JWT_SECRET = getRequiredEnv("JWT_SECRET");
const ACCESS_TOKEN_EXPIRES_IN = "15m";

export interface AccessTokenPayload {
  userId: string;
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, JWT_SECRET) as unknown as AccessTokenPayload;
}

const JWT_REFRESH_SECRET = getRequiredEnv("JWT_REFRESH_SECRET");
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export interface RefreshTokenPayload {
  userId: string;
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, JWT_REFRESH_SECRET) as unknown as RefreshTokenPayload;
}

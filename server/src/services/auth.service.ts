import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { hashPassword } from "../utils/password";
import { RegisterInput } from "../validations/auth.validation";
import { comparePassword } from "../utils/password";
import {
  RefreshTokenPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { LoginInput } from "../validations/auth.validation";
import { hashToken } from "../utils/hashToken";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function createRefreshToken(userId: string): Promise<string> {
  const refreshToken = signRefreshToken({ userId });

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return refreshToken;
}

export async function registerUser(input: RegisterInput) {
  const hashedPassword = await hashPassword(input.password);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return user;
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw err;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const accessToken = signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = await createRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  let payload: RefreshTokenPayload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const tokenHash = hashToken(refreshToken);

  const storedToken = await prisma.refreshToken.findUnique({
    where: { tokenHash },
  });

  if (
    !storedToken ||
    storedToken.revoked ||
    storedToken.expiresAt < new Date()
  ) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user) {
    throw new Error("INVALID_REFRESH_TOKEN");
  }

  const newAccessToken = signAccessToken({ userId: user.id, role: user.role });

  return { accessToken: newAccessToken };
}

export async function logoutUser(refreshToken: string): Promise<void> {
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
}

import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { hashPassword } from "../utils/password";
import { RegisterInput } from "../validations/auth.validation";
import { comparePassword } from "../utils/password";
import { signAccessToken } from "../utils/jwt";
import { LoginInput } from "../validations/auth.validation";

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

  return {
    accessToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
}

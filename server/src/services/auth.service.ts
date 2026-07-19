import { prisma } from "../config/prisma";
import { Prisma } from "../generated/prisma/client";
import { hashPassword } from "../utils/password";
import { RegisterInput } from "../validations/auth.validation";

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

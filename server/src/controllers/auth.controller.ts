import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { registerSchema } from "../validations/auth.validation";
import { registerUser } from "../services/auth.service";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const user = await registerUser(parsed.data);

    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_ALREADY_EXISTS") {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }
    next(err);
  }
}

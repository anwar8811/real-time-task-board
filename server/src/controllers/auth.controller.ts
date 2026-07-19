import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { registerSchema } from "../validations/auth.validation";
import { registerUser } from "../services/auth.service";

import { loginSchema } from "../validations/auth.validation";
import { loginUser } from "../services/auth.service";

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

export async function login(req: Request, res: Response, next: NextFunction) {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const result = await loginUser(parsed.data);

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    next(err);
  }
}

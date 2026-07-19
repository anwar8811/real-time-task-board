import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { registerSchema } from "../validations/auth.validation";
import { registerUser } from "../services/auth.service";

import { loginSchema } from "../validations/auth.validation";
import { loginUser } from "../services/auth.service";

import { refreshTokenSchema } from "../validations/auth.validation";
import {
  refreshAccessToken,
  logoutUser,
  getUserById,
} from "../services/auth.service";

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

export async function refresh(req: Request, res: Response, next: NextFunction) {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const result = await refreshAccessToken(parsed.data.refreshToken);

    return res.status(200).json({
      message: "Access token refreshed",
      ...result,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_REFRESH_TOKEN") {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  const parsed = refreshTokenSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    await logoutUser(parsed.data.refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  try {
    const user = await getUserById(req.user.userId);
    return res.status(200).json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "User not found." });
    }
    next(err);
  }
}

export function adminCheck(req: Request, res: Response) {
  return res.status(200).json({
    message: `Welcome, admin! Your user id is ${req.user?.userId}.`,
  });
}

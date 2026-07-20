import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createTaskSchema } from "../validations/task.validation";
import { createTask } from "../services/task.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  const parsed = createTaskSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const task = await createTask(req.user.userId, parsed.data);
    return res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    next(err);
  }
}

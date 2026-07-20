import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  createTaskSchema,
  listTasksQuerySchema,
  taskIdParamSchema,
  updateTaskSchema,
} from "../validations/task.validation";
import {
  createTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../services/task.service";

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

export async function list(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  const parsed = listTasksQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsed.error).fieldErrors,
    });
  }

  try {
    const tasks = await listTasks(req.user, parsed.data);
    return res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  const parsedParams = taskIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsedParams.error).fieldErrors,
    });
  }

  try {
    const task = await getTaskById(req.user, parsedParams.data.id);
    return res.status(200).json({ task });
  } catch (err) {
    if (err instanceof Error && err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Task not found." });
    }
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }

  const parsedParams = taskIdParamSchema.safeParse(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsedParams.error).fieldErrors,
    });
  }

  const parsedBody = updateTaskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: z.flattenError(parsedBody.error).fieldErrors,
    });
  }

  try {
    const task = await updateTask(
      req.user,
      parsedParams.data.id,
      parsedBody.data,
    );
    return res.status(200).json({ message: "Task updated successfully", task });
  } catch (err) {
    if (err instanceof Error && err.message === "TASK_NOT_FOUND") {
      return res.status(404).json({ message: "Task not found." });
    }
    next(err);
  }
}

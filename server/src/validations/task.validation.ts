import { z } from "zod";
import { TaskStatus } from "../generated/prisma/client";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const listTasksQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(TaskStatus).optional(),
});

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

export const taskIdParamSchema = z.object({
  id: z.string().min(1, "Task id is required"),
});

export type TaskIdParam = z.infer<typeof taskIdParamSchema>;

export const updateTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().optional(),
  status: z.enum(TaskStatus).optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const assignOwnerSchema = z.object({
  ownerId: z.string().min(1, "ownerId is required"),
});

export type AssignOwnerInput = z.infer<typeof assignOwnerSchema>;

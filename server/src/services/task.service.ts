import { prisma } from "../config/prisma";
import {
  AssignOwnerInput,
  CreateTaskInput,
  UpdateTaskInput,
} from "../validations/task.validation";
import { Role } from "../generated/prisma/client";
import { AccessTokenPayload } from "../utils/jwt";
import { ListTasksQuery } from "../validations/task.validation";
import { broadcastTaskEvent, notifyUser } from "../sockets/broadcast";

export async function createTask(ownerId: string, input: CreateTaskInput) {
  const task = await prisma.task.create({
    data: { title: input.title, description: input.description, ownerId },
  });

  broadcastTaskEvent("task:created", task.ownerId, task);

  return task;
}

export async function listTasks(
  currentUser: AccessTokenPayload,
  query: ListTasksQuery,
) {
  return prisma.task.findMany({
    where: {
      ownerId: currentUser.role === Role.ADMIN ? undefined : currentUser.userId,
      status: query.status,
      title: query.search
        ? { contains: query.search, mode: "insensitive" }
        : undefined,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTaskById(
  currentUser: AccessTokenPayload,
  taskId: string,
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const isOwner = task.ownerId === currentUser.userId;
  const isAdmin = currentUser.role === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("TASK_NOT_FOUND");
  }

  return task;
}

export async function updateTask(
  currentUser: AccessTokenPayload,
  taskId: string,
  input: UpdateTaskInput,
) {
  const existingTask = await prisma.task.findUnique({ where: { id: taskId } });

  if (!existingTask) {
    throw new Error("TASK_NOT_FOUND");
  }

  const isOwner = existingTask.ownerId === currentUser.userId;
  const isAdmin = currentUser.role === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("TASK_NOT_FOUND");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: input,
  });

  broadcastTaskEvent("task:updated", updatedTask.ownerId, updatedTask);

  return updatedTask;
}

export async function assignOwner(taskId: string, input: AssignOwnerInput) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const newOwner = await prisma.user.findUnique({
    where: { id: input.ownerId },
  });

  if (!newOwner) {
    throw new Error("OWNER_NOT_FOUND");
  }

  const previousOwnerId = task.ownerId;

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: { ownerId: input.ownerId },
  });

  broadcastTaskEvent("task:updated", updatedTask.ownerId, updatedTask);

  if (previousOwnerId !== updatedTask.ownerId) {
    notifyUser(previousOwnerId, "task:updated", updatedTask);
  }

  return updatedTask;
}

export async function deleteTask(
  currentUser: AccessTokenPayload,
  taskId: string,
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });

  if (!task) {
    throw new Error("TASK_NOT_FOUND");
  }

  const isOwner = task.ownerId === currentUser.userId;
  const isAdmin = currentUser.role === Role.ADMIN;

  if (!isOwner && !isAdmin) {
    throw new Error("TASK_NOT_FOUND");
  }

  await prisma.task.delete({ where: { id: taskId } });

  broadcastTaskEvent("task:deleted", task.ownerId, { id: taskId });
}

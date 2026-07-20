import { prisma } from "../config/prisma";
import { CreateTaskInput } from "../validations/task.validation";

export async function createTask(ownerId: string, input: CreateTaskInput) {
  return prisma.task.create({
    data: {
      title: input.title,
      description: input.description,
      ownerId,
    },
  });
}

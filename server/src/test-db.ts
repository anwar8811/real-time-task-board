import { prisma } from "./config/prisma";

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@example.com",
      password: "temporary-plain-text-for-now",
    },
  });

  console.log("Created user:", user);

  const task = await prisma.task.create({
    data: {
      title: "My first task",
      ownerId: user.id,
    },
  });

  console.log("Created task:", task);

  const allUsers = await prisma.user.findMany({
    include: { tasks: true },
  });

  console.log("All users with their tasks:", JSON.stringify(allUsers, null, 2));
}

main()
  .catch((err) => console.error("Something went wrong:", err))
  .finally(() => prisma.$disconnect());

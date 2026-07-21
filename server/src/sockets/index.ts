import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyAccessToken } from "../utils/jwt";
import { Role } from "../generated/prisma/client";

let ioInstance: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  });

  ioInstance.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication token is missing."));
    }

    try {
      socket.data.user = verifyAccessToken(token);
      next();
    } catch {
      next(new Error("Invalid or expired token."));
    }
  });

  ioInstance.on("connection", (socket) => {
    const { userId, role } = socket.data.user;

    socket.join(`user:${userId}`);
    if (role === Role.ADMIN) {
      socket.join("role:ADMIN");
    }

    console.log(`Socket connected: ${socket.id} (user: ${userId})`);

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return ioInstance;
}

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error(
      "Socket.io has not been initialized yet. Call initializeSocket first.",
    );
  }
  return ioInstance;
}

import { Server } from "socket.io";
import type { Server as HttpServer } from "http";

let ioInstance: Server | null = null;

export function initializeSocket(httpServer: HttpServer): Server {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

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

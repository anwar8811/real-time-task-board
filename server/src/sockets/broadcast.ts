import { getIO } from "./index";

export function broadcastTaskEvent(
  event: string,
  ownerId: string,
  payload: unknown,
) {
  getIO().to(`user:${ownerId}`).to("role:ADMIN").emit(event, payload);
}

export function notifyUser(userId: string, event: string, payload: unknown) {
  getIO().to(`user:${userId}`).emit(event, payload);
}

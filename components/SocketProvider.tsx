"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/lib/axios";
import { useAuth } from "@/components/AuthProvider";

interface SocketContextValue {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextValue>({ socket: null });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncSocket = async () => {
      if (!user) {
        socketRef.current?.disconnect();
        socketRef.current = null;
        setSocket(null);
        return;
      }

      const response = await api.get("/auth/socket-token");
      if (cancelled) return;

      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        auth: { token: response.data.token },
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    };

    syncSocket();

    return () => {
      cancelled = true;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

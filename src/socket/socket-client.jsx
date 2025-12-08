import { io } from "socket.io-client";
import { useAuthSelector } from "../store/useAuthStore";

let socket = null;

export const initSocket = (token) => {
  if (!socket) {
    socket = io("http://localhost:8000", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("Socket connected", socket?.id));

    socket.on("disconnect", (reason) =>
      console.log("Socket disconnected", reason),
    );

    socket.on("connect_error", (err) =>
      console.error("Socket connect error:", err.message),
    );
  }

  return socket;
};

export const getSocket = () => {
  const token = useAuthSelector((state) => state.token);

  if (token) {
    const socketInstance = initSocket(token);
    return socketInstance;
  }

  return null; // an toàn hơn {}
};

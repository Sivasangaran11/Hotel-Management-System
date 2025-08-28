import { io } from "socket.io-client";

const backendUri = import.meta.env.VITE_BACKEND_URI; // Ensure this is set in .env
export const socket = io(backendUri, {
  transports: ["websocket"],
  reconnection: true,  // Allow reconnection
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
});

import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket;

export function useSocket(onNewLead) {
  useEffect(() => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });
    }

    const handleNewLead = (payload) => {
      if (typeof onNewLead === "function") {
        onNewLead(payload.lead);
      }
    };

    socket.on("new_lead", handleNewLead);

    return () => {
      socket.off("new_lead", handleNewLead);
    };
  }, [onNewLead]);
}


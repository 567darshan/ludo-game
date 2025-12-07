import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // In offline mode, we don't connect sockets at all
    if (!token || token === "offline-token") {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const s = io("http://localhost:5000", {
      auth: { token },
    });

    s.on("connect", () => console.log("Socket connected", s.id));
    s.on("disconnect", () => console.log("Socket disconnected"));

    setSocket(s);

    return () => {
      s.disconnect();
      setSocket(null);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

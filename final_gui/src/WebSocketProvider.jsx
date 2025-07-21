import { createContext, useEffect, useState } from 'react';

export const WSContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/ws"); // Make sure this matches your Go server

    ws.onopen = () => {
      console.log("WebSocket connected ✅");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected ❌");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);
  }, []);

  return <WSContext.Provider value={socket}>{children}</WSContext.Provider>;
};

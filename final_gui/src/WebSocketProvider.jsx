import { createContext, useEffect, useState } from 'react';
export const WSContext = createContext({
    socket: null,
    role: null,
    peerIP: null,
    otp: null,
    messages: [],
    addMessage: () => {},
});

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [role, setRole] = useState(null);
  const [peerIP, setPeerIP] = useState(null);
  const [otp, setOtp] = useState(null);
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  useEffect(() => {
   const ws = new WebSocket("ws://10.124.90.54:8080/ws");
    ws.onopen = () => {
      console.log("WebSocket connected ✅");
    };
    ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('WS Message:', message);

            switch (message.type) {
                case 'host_announce_ack':
                    console.log('Host registered with OTP:', message.otp);
                    setOtp(message.otp);
                    break;

                case 'join_request_ack':
                    console.log('Joined host with OTP:', message.otp);
                    setOtp(message.otp);
                    break;
                case 'peer_connected':
                    if (message.host_ip) {
                      console.log('I am the joiner');
                      setRole('joiner');
                      setPeerIP(message.host_ip);
                    } else if (message.joiner_ip) {
                      console.log('I am the host');
                      setRole('host');
                      setPeerIP(message.joiner_ip);
                    }
                    break;
                case 'message': {
                const { payload } = message;
                    console.log(' Chat message received:', payload);
                    addMessage({
                      text: payload.message,
                      timestamp: payload.timestamp
                    });
        
                  break;
                  }

                default:
                    console.warn('Unhandled WS message:', message);
            }
        };
    ws.onclose = () => {
      console.log("WebSocket disconnected ❌");
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    setSocket(ws);
    return () => {
    ws?.close();
  };
  }, []);

  return <WSContext.Provider value={{socket, role, peerIP, messages, otp ,addMessage}}>{children}</WSContext.Provider>;
};

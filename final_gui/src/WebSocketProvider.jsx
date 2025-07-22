import { createContext, useEffect, useState } from 'react';
export const WSContext = createContext({
    socket: null,
    role: null,
    peerIP: null,
    otp: null,
    publicKey: null,
    messages: [],
    addMessage: () => {},
    leaveSession: () => {},
});

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [role, setRole] = useState(null);
  const [peerIP, setPeerIP] = useState(null);
  // eslint-disable-next-line 
  const [otp, setOtp] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [messages, setMessages] = useState([]);

  const addMessage = (msg, index = null) => {
    setMessages(prev =>
      index !== null
        ? prev.map((m, i) => (i === index ? msg : m))
        : [...prev, msg]
    );
  };
  const leaveSession = () => {
    if (socket.current) {
      socket.current.send(JSON.stringify({ type: "leave_session" }));
      socket.current.close(); // close WebSocket
      socket.current = null;
    }
    setRole(null);
    setPeerIP(null);
    setMessages([]);
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  // const ip = "10.16.245.143";
  const localIp = "192.168.68.123"
   const ws = new WebSocket(`ws://${localIp}:8080/ws`);
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
                case 'public_key':
                    setPublicKey(message.publicKey);
                    console.log('Received public key:', message.publicKey);
                    break;
                case 'message': 
                const { payload } = message;
                    console.log(' Chat message received:', payload);
                    addMessage({
                      text: payload.message,
                      timestamp: payload.timestamp
                    });
                  break;
                case 'file_received':
                  const newMessage = {
                    text: "[File Received]",
                    type: "file",
                    fromSelf: false,
                    timestamp: Date.now(),
                    file: {
                      name: message.filename,
                      mime: message.mimetype,
                      encrypted: message.encrypted,
                      content: message.payload,
                    }
                  };
                  setMessages((prev) => [...prev, newMessage]);
                  break;


                default:
                    console.warn('Unhandled WS message:', message);
                    break;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return <WSContext.Provider value={{socket, role, peerIP, publicKey, messages,otp,addMessage, leaveSession}}>{children}</WSContext.Provider>;
};

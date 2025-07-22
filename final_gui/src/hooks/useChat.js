import { useContext } from "react";
import { WSContext } from "../WebSocketProvider";


export function useChat() {
    const { socket, role, peerIP, otp,messages,addMessage } = useContext(WSContext);

    if (!socket) {
        console.error("WebSocket context is not available. Ensure you are using the WebSocketProvider.");
    }

    const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload = {
                type: "chat_message",
                otp,
                "payload": {
                    message,
                    timestamp: Date.now(),
                },
            };
            socket.send(JSON.stringify(payload));
            console.log("✅ Sent chat message:", payload);

            addMessage({ text: message, timestamp: Date.now(), fromSelf: true });
        } else {
            console.warn("WebSocket is not open. Cannot send message.");
        }
    };

    const sendFile = (file) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload = {
                type: "file_transfer",
                fileName: file.name,
                fileSize: file.size,
                timestamp: Date.now(),
            };
            socket.send(JSON.stringify(payload));
            console.log("✅ Sent file transfer request:", payload);
        } else {
            console.warn("WebSocket is not open. Cannot send file.");
        }
    };

    return { sendMessage, sendFile, role, peerIP, messages, otp};
}
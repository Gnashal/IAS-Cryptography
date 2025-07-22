import { useContext, useEffect } from "react";
import { WSContext } from "../WebSocketProvider";
import { dickTwistEncrypt } from "../lib/encrypt.ts";


export function useChat() {
    const { socket, role, peerIP,publicKey ,otp,messages,addMessage } = useContext(WSContext);

    if (!socket) {
        console.error("WebSocket context is not available. Ensure you are using the WebSocketProvider.");
    }
    function fixPemFormat(pem) {
    return pem
        .replace(/-----BEGIN PUBLIC KEY-----/, '-----BEGIN PUBLIC KEY-----\n')
        .replace(/-----END PUBLIC KEY-----/, '\n-----END PUBLIC KEY-----')
        .replace(/(.{64})/g, '$1\n'); // Add newlines every 64 characters
}

     const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const plainPayload = {
                message,
                timestamp: Date.now(),
            };
            const fixedPEM = fixPemFormat(publicKey);
            console.log(publicKey);
            console.log("Fixed PEM:", fixedPEM);
            const encryptedPayload = dickTwistEncrypt(JSON.stringify(plainPayload), otp, publicKey);

            const payload = {
                type: "chat_message",
                otp: otp,
                payload: encryptedPayload,
            };

            socket.send(JSON.stringify(payload));
            console.log("✅ Sent ENCRYPTED chat message:", payload);

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
    useEffect(() => {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
    }, [messages]);


    return { sendMessage, sendFile, role, peerIP, messages, otp};
}
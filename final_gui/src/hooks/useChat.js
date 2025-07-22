import { useContext, useEffect, useState } from "react";
import { WSContext } from "../WebSocketProvider";
import { dickTwistEncrypt } from "../lib/encrypt.ts";
import { DickTwistFileDecrypt, DickTwistFileEncrypt,  } from "../lib/file.ts";
import { useNavigate } from "react-router-dom";

export function useChat() {
    const { socket, role, peerIP,publicKey ,otp,messages,addMessage, leaveSession} = useContext(WSContext);
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    if (!socket) {
        console.error("WebSocket context is not available. Ensure you are using the WebSocketProvider.");
    }


     const sendMessage = (message) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const plainPayload = {
                message,
                timestamp: Date.now(),
            };
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
                type: "file",
                otp: otp,
                filename: file.filename,
                mimetype: file.type,
                content: file.content, // already encrypted
                encrypted: file.encrypted,
                timestamp: Date.now(),
            };
            socket.send(JSON.stringify(payload));
            console.log("✅ Sent file transfer request:", payload);
        } else {
            console.warn("WebSocket is not open. Cannot send file.");
        }
    };
    const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const arrayBuffer = reader.result;
        const encrypted = DickTwistFileEncrypt(arrayBuffer, otp);

        sendFile({
        filename: file.name,
        type: file.type,
        content: encrypted,
        encrypted: true,
        timestamp: Date.now(),
        fromSelf: true,
        });

        addMessage({
        type: "file",
        file: {
            name: file.name,
            mime: file.type,
            content: encrypted,
            encrypted: true,
        },
        timestamp: Date.now(),
        fromSelf: true,
        });
    };

  reader.readAsArrayBuffer(file);
};

    const handleSend = () => {
        if (input.trim() === "") return; 
        sendMessage(input.trim());
        setInput(""); 
      };
    
      const handleLeaveAndBack = () => {
        if (leaveSession) leaveSession(); 
        navigate('/');           
    };
    
      const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      };

    const handleDecryptFile = (msgIndex) => {
        const updatedMessages = [...messages];
        const msg = updatedMessages[msgIndex];

        if (msg?.file?.encrypted) {
            const decryptedBuffer = DickTwistFileDecrypt(msg.file.content, otp);

            const blob = new Blob([decryptedBuffer], { type: msg.file.mime });
            const url = URL.createObjectURL(blob);

            // This is the fucking fix kay di jud mu gana if i store the blob and update the 
            // message with the URL directly
            // crashing out alr
            const a = document.createElement("a");
            a.href = url;
            a.download = msg.file.name;
            a.click();

            msg.file.encrypted = false;
            msg.file.content = url;

            addMessage(updatedMessages[msgIndex], msgIndex);
        }
    };
    // Solution 2
    // const handleDecryptFile = (msgIndex) => {
    //     const msg = messages[msgIndex];

    //     if (msg?.file?.encrypted) {
    //         const decryptedBuffer = DickTwistFileDecrypt(msg.file.content, otp);

    //         const blob = new Blob([decryptedBuffer], { type: msg.file.mime });
    //         const url = URL.createObjectURL(blob);

    //         // Construct new message object
    //         const updatedMsg = {
    //         ...msg,
    //         file: {
    //             ...msg.file,
    //             encrypted: false,
    //             content: url, // decrypted file blob URL
    //         },
    //         };

    //         // Replace the message immutably
    //         const updatedMessages = [...messages];
    //         updatedMessages[msgIndex] = updatedMsg;

    //         addMessage(updatedMsg, msgIndex); // assuming this updates and rerenders
    //     }
    // };



    useEffect(() => {
    const chatWindow = document.querySelector('.chat-window');
    if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
    }, [messages]);


    return { sendMessage, sendFile, role, peerIP, messages, otp, 
        handleFileChange, handleKeyPress, handleLeaveAndBack,
        handleSend, handleDecryptFile,input, setInput };
}
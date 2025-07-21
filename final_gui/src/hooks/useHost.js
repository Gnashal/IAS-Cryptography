import { useState, useEffect, useContext } from 'react';
import {WSContext} from '../WebSocketProvider';
const generateOTP = () => {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
};

export function useHost() {
    const socket = useContext(WSContext);
    if (!socket) {
        console.error("WebSocket context is not available. Ensure you are using the WebSocketProvider.");
    }
    const [otp, setOtp] = useState(() => {
        const saved = localStorage.getItem('host-otp');
        return saved || generateOTP();
    });

    useEffect(() => {
        console.log("useHost loaded with otp:", otp);
        localStorage.setItem('host-otp', otp);

        if (socket.readyState === WebSocket.OPEN) {
        const payload = {
            type: "host_announce",
            otp: otp,
            timestamp: Date.now(),
        };
        socket.send(JSON.stringify(payload));
        console.log("Sending host_announce", payload);

    } else {
        socket.addEventListener('open', () => {
            const payload = {
                type: "host_announce",
                otp: otp,
                timestamp: Date.now(),
            };
            socket.send(JSON.stringify(payload));
            console.log("Sending host_announce", payload);

        }, { once: true }); // Don't attach forever
    }

    }, [otp]);

    const regenerateOtp = () => {
        const newOtp = generateOTP();
        setOtp(newOtp);
        localStorage.setItem('host-otp', newOtp);
    };

    return { otp, regenerateOtp };
}
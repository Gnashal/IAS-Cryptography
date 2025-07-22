import { useState, useEffect, useContext, useRef } from 'react';
import { WSContext } from '../WebSocketProvider';
import { useNavigate } from 'react-router-dom';
const generateOTP = () => {
    return Math.random().toString(36).substring(2, 18).toUpperCase();
};

export function useHost() {
    const {socket, peerIP} = useContext(WSContext);
    const hasAnnouncedRef = useRef(false);
    const navigate = useNavigate();
    if (!socket) {
        console.error("WebSocket context is not available. Ensure you are using the WebSocketProvider.");
    }

    const [otp, setOtp] = useState(() => {
        const saved = localStorage.getItem('host-otp');
        return saved || generateOTP();
    });

    useEffect(() => {
        if (!socket || hasAnnouncedRef.current) return;

        const payload = {
            type: "host_announce",
            otp,
            timestamp: Date.now(),
        };

        const announce = () => {
            socket.send(JSON.stringify(payload));
            console.log("✅ Sent host_announce", payload);
            hasAnnouncedRef.current = true;
        };

        if (socket.readyState === WebSocket.OPEN) {
            announce();
        } else {
            socket.addEventListener('open', announce, { once: true });
        }
    }, [socket, otp]); 

    const regenerateOtp = () => {
        const newOtp = generateOTP();
        setOtp(newOtp);
        localStorage.setItem('host-otp', newOtp);
        hasAnnouncedRef.current = false; //  allow resend with new OTP
    };
    useEffect(() => {
        if (peerIP) {
            navigate('/chat');
        }
        }, [peerIP, navigate]);
    return { otp, regenerateOtp, navigate };
}

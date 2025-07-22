import { useState, useContext, useEffect } from 'react';
import { WSContext } from '../WebSocketProvider';
import { useNavigate } from 'react-router-dom';
export function useJoin() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const {socket, peerIP} = useContext(WSContext);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected.");
            return;
        }

        setLoading(true);

        const payload = {
            type: 'join_request',
            otp: otp.trim(),
            timestamp: Date.now(),
        };

        socket.send(JSON.stringify(payload));
        console.log("📨 Sent join_request:", payload);

        // Optional: wait for server response or use `onmessage` to detect success
        setTimeout(() => {
            setLoading(false);
            console.log('Joined with OTP:', otp);
        }, 2000);
    };
    useEffect(() => {
    if (peerIP) {
        navigate('/chat');
    }
    }, [peerIP, navigate]);
    return {
        otp,
        setOtp,
        loading,
        handleSubmit,
        peerIP,
        navigate
    };
}

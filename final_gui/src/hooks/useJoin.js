import { useState } from 'react';

export function useJoin() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    
        const handleSubmit = (e) => {
            e.preventDefault();
            setLoading(true);
    
            // Simulate API call — replace with axios later
            setTimeout(() => {
                setLoading(false);
                // navigate or handle connection success
                console.log('Joined with OTP:', otp);
            }, 2000);
        };

          return {
        otp,
        setOtp,
        loading,
        handleSubmit
    };
}
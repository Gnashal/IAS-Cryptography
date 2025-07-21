import { useNavigate } from 'react-router-dom';
import { useHost } from '../hooks/useHost';
import backIcon from '../icons/back.svg';
import '../styles/host.css';

export function Host() {
    const navigate = useNavigate();
    const { otp, regenerateOtp } = useHost();

    return (
        <div className="host-container">
            <button
                className="back-button"
                onClick={() => navigate(-1)}
                title="Go Back"
            >
                <img src={backIcon} alt="Back" className="back-icon" />
            </button>

            <div className="otp-section">
                <h1 className="otp-title">This is your OTP</h1>
                <h2 className="otp">{otp}</h2>
                <button className="generate-button" onClick={regenerateOtp}>
                    Generate New OTP
                </button>
                <p className="otp-info">Share this code with your peer to connect.</p>
            </div>

            <h1 className="waiting-message">Waiting for peer to connect...</h1>
            <div className="loader"></div>
        </div>
    );
}
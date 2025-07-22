import '../styles/join.css';
import { useJoin } from '../hooks/useJoin';
import { useNavigate } from 'react-router-dom';
import backIcon from '../icons/back.svg';

export function Join() {
    const navigate = useNavigate();
    const {setOtp, loading, otp, handleSubmit} = useJoin();
    

    return (
        <div className="join-container">
            <button
                    className="back-button"
                    onClick={() => navigate(-1)}
                    title="Go Back"
                    >
                    <img src={backIcon} alt="Back" className="back-icon" />
            </button>
            <form className="join-form" onSubmit={handleSubmit}>
                <label htmlFor="otp-input" className="join-label">Input OTP from peer</label>
                <input
                    id="otp-input"
                    type="text"
                    className="join-input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit" className="join-button" disabled={loading}>
                    {loading ? 'Joining...' : 'Join'}
                </button>
                {loading && <div className="loader"></div>}
            </form>
        </div>
    );
}

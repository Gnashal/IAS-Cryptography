import '../styles/dashboard.css';
import joinIcon from '../icons/join.svg';
import hostIcon from '../icons/host.svg';
import { useNavigate } from 'react-router';


export function Dashboard() {
    const nav = useNavigate();

    return (
        <div className="dash">
            <div className="choice-container">
                <div className="choice-button-container">
                    <button className="choice-button"
                    onClick={() =>nav('/host')}>
                        <div className="icon">
                            <img src={hostIcon} alt="Host Icon" className="icon-img" />
                        </div>
                        <span className="label">Host a connection</span>
                    </button>
                </div>
                <div className="choice-button-container">
                    <button className="choice-button"
                    onClick={() =>nav('/join')} >
                        <div className="icon">
                            <img src={joinIcon} alt="Join Icon" className="icon-img" />
                        </div>
                        <span className="label">Join a connection</span>
                    </button>
                </div>
            </div>  
        </div>
    );
}

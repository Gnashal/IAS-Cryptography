import { useContext, useState } from 'react';
import { WSContext } from '../WebSocketProvider';
import { useNavigate } from 'react-router-dom';
import backIcon from '../icons/back.svg';
import '../styles/chat.css';
import { useChat } from '../hooks/useChat';
export function ChatPage() {
    const { peerIP, role, messages} = useContext(WSContext);
    const {sendMessage} = useChat();
    const navigate = useNavigate();
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input.trim());
            setInput("");
        }
    };
  return (
    <div className="chat-container">
      <button
        className="back-button"
        onClick={() => navigate(-1)}
        title="Go Back"
      >
        <img src={backIcon} alt="Back" className="back-icon" />
      </button>

      <div className="chat-header">
        <h2>Chat & File Sharing</h2>
        <p className="chat-meta">Your role: <strong>{role || "unknown"}</strong></p>
        <p className="chat-meta">Connected to: <strong>{peerIP || "N/A"}</strong></p>
      </div>

      <div className="chat-window">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-bubble ${msg.fromSelf ? 'self' : 'peer'}`}>
                        <p>{msg.text}</p>
                        <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
            </div>

         <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="chat-input"
                />
                <button onClick={handleSend} className="send-button">Send</button>
          </div>
    </div>
  );
}


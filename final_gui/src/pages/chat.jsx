import { useContext, useState } from 'react';
import { WSContext } from '../WebSocketProvider';
import { useNavigate } from 'react-router-dom';
import backIcon from '../icons/back.svg';
import '../styles/chat.css';
import { useChat } from '../hooks/useChat';
export function ChatPage() {
    const { peerIP, role, messages, leaveSession} = useContext(WSContext);
    const {sendMessage} = useChat();
    const navigate = useNavigate();
    const [input, setInput] = useState("");

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
  return (
  <div className="chat-container">
    <div className="chat-sidebar">
      <button
        className="back-button"
        onClick={handleLeaveAndBack}
        title="Leave Session"
      >
        <img src={backIcon} alt="Back" className="back-icon" />
      </button>

      <div className="chat-header">
        <h2>IAS Chat and File Sharing</h2>
        <p className="chat-meta">Your role: <strong>{role || "unknown"}</strong></p>
        <p className="chat-meta">Connected to: <strong>{peerIP || "N/A"}</strong></p>
      </div>
    </div>

    <div className="chat-main">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.fromSelf ? 'self' : 'peer'}`}>
            <p>{msg.text}</p>
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <label className="file-button">
          📎
            <input type="file" hidden onChange={(e) => console.log(e.target.files)} />
          </label>

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="chat-input"
          />

          <button onClick={handleSend} className="send-button">Send</button>
      </div>
    </div>
  </div>
);

}


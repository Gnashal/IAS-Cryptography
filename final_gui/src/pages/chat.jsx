import { useContext } from 'react';
import { WSContext } from '../WebSocketProvider';
import backIcon from '../icons/back.svg';
import '../styles/chat.css';
import { useChat } from '../hooks/useChat';
export function ChatPage() {
    const { peerIP, role, messages} = useContext(WSContext);
    const {handleKeyPress,handleSend,handleLeaveAndBack,
      handleDecryptFile ,handleFileChange, input, setInput} = useChat();

    
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
          {msg.type === "file" ? (
             <div className="file-bubble">
              <p><strong>{msg.file.name}</strong></p>

              <a
                href={`data:${msg.file.mime};base64,${btoa(msg.file.content)}`}
                download={msg.file.name}
              >
                Download
              </a>

              {msg.file.encrypted && (
                <button onClick={() => handleDecryptFile(i)}>Decrypt</button>
              )}

              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ) : (
            <>
              <p>{msg.text}</p>
              <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </>
          )}
        </div>
      ))}
      </div>

      {/* Input area */}


      <div className="chat-input-container">
        <label className="file-button">
          📎
            <input type="file" hidden onChange={handleFileChange} />
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


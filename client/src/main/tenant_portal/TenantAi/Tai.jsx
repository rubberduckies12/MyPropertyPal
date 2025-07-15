import React, { useState, useRef, useEffect } from 'react';
import TenantSidebar from '../tsidebar/tenantSidebar.jsx';
import '../../chatbot/chatbot.css';
import { fetchChatbotReply } from '../../chatbot/chatbot.js';
import ReactMarkdown from 'react-markdown';

function Tai() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, loading]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { role: 'user', content: message };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage('');
    setLoading(true);

    try {
      const reply = await fetchChatbotReply(updatedHistory);
      setChatHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, something went wrong." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <TenantSidebar />
      <main className="dashboard-main">
        <div className={`chatbot-container${chatHistory.length > 0 ? ' has-messages' : ''}`}>
          <div className="chatbot-header">
            What's on your mind?
          </div>
          <div className="chatbot-history">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.role}`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            ))}
            {loading && (
              <div className="chatbot-message assistant chatbot-typing">
                <p>Typing<span className="typing-dots">...</span></p>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Ask anything about property management..."
              className="chatbot-input"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              className="chatbot-send-btn"
              disabled={loading || !message.trim()}
            >
              &#9658;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tai;
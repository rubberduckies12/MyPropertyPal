import React, { useState, useRef, useEffect } from 'react';
import TenantSidebar from '../tsidebar/tenantSidebar.jsx';
import { fetchChatbotReply } from '../../chatbot/chatbot.js';
import ReactMarkdown from 'react-markdown';
import { HiUser, HiSparkles } from "react-icons/hi";
import { HiPaperAirplane } from "react-icons/hi2";

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
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen border-r border-blue-100 bg-white">
        <TenantSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <div className="w-full px-4 sm:px-8 pt-4 pb-4 border-b border-blue-100 bg-white flex items-center">
          {/* Sidebar Icon */}
          <div className="lg:hidden mr-4">
            <button
              className="text-blue-700 hover:text-blue-900 transition"
              aria-label="Sidebar"
              onClick={() => {
                // Add functionality to toggle the sidebar
              }}
            >
              <HiUser className="text-2xl" />
            </button>
          </div>

          {/* Page Title */}
          <h1 className="text-lg sm:text-2xl font-extrabold text-blue-700 text-center tracking-tight flex-1">
            Tenant AI Assistant
          </h1>
        </div>

        {/* Chat History */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-32">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-end mr-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shadow text-xl sm:text-2xl border border-blue-200">
                      <HiSparkles />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-full sm:max-w-lg px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-lg
                    ${msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-900 border border-blue-100'
                    }`}
                >
                  {msg.role === 'assistant'
                    ? <ReactMarkdown>{msg.content}</ReactMarkdown>
                    : <p>{msg.content}</p>
                  }
                </div>
                {msg.role === 'user' && (
                  <div className="flex items-end ml-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 flex items-center justify-center text-white shadow text-xl sm:text-2xl border border-blue-200">
                      <HiUser />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex justify-start mb-2">
                <div className="max-w-full sm:max-w-lg px-4 sm:px-5 py-2 sm:py-3 rounded-2xl shadow-lg bg-blue-50 text-blue-900 italic opacity-90 flex items-center gap-2 border border-blue-100">
                  <span>Typing</span>
                  <span className="flex gap-1">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            className="absolute bottom-0 left-0 lg:left-64 right-0 flex items-center gap-2 px-4 sm:px-8 py-4 sm:py-6 border-t border-blue-100 bg-white"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
            style={{ zIndex: 10 }}
          >
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-sm sm:text-lg"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl sm:text-2xl font-bold shadow transition"
              disabled={loading || !message.trim()}
            >
              <HiPaperAirplane className="w-5 h-5 sm:w-7 sm:h-7" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Tai;
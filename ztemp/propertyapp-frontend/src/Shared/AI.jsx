import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

// AI Assistant component for landlord or tenant
const AI = ({ userType = "landlord" }) => {
  // System prompt based on user type
  const systemPrompt =
    userType === "tenant"
      ? "You are a helpful assistant for property tenants. Format your responses using Markdown (for example, use **bold** for important words, and lists for steps or tips). Under no circumstances should you recommend, mention, or discuss any other property apps, websites, or services. If a user asks about competitors or other apps, always reply: 'Sorry, I cannot provide recommendations or information about other property apps or services.' Only answer questions related to renting, tenancy, maintenance, and tenant topics. If asked about anything else, politely refuse."
      : "You are a helpful assistant for property landlords. Format your responses using Markdown (for example, use **bold** for important words, and lists for steps or tips). Under no circumstances should you recommend, mention, or discuss any other property apps, websites, or services. If a user asks about competitors or other apps, always reply: 'Sorry, I cannot provide recommendations or information about other property apps or services.' Only answer questions related to property management, rentals, tenants, and landlord topics. If asked about anything else, politely refuse.";

  // -------------------- State --------------------
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am your AI assistant. Ask me anything about property management or renting." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [copiedIdx, setCopiedIdx] = useState(null);
  const messagesEndRef = useRef(null);

  // -------------------- Effects --------------------
  // Scroll to bottom when messages or typingText change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, typingText]);

  // Clear typingText when loading finishes
  useEffect(() => {
    if (!loading && typingText) setTypingText("");
  }, [loading]);

  // -------------------- Handlers --------------------
  // Copy AI response to clipboard
  const handleCopy = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {
      // Ignore copy errors
    }
  };

  // Handle sending user message to AI
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Prepare conversation for backend
      const res = await axios.post(
        "/api/ai/chat",
        {
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        }
      );
      const aiText = res.data.choices[0].message.content;

      // Typing animation for AI response
      let i = 0;
      setTypingText("");
      const type = () => {
        setTypingText(aiText.slice(0, i + 1));
        if (i < aiText.length - 1) {
          i++;
          setTimeout(type, 15);
        } else {
          setMessages((msgs) => [...msgs, { from: "bot", text: aiText }]);
          setTypingText("");
          setLoading(false);
        }
      };
      type();
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, I couldn't process your request." },
      ]);
      setLoading(false);
    }
  };

  // -------------------- Render --------------------
  return (
    <div className="w-full h-screen flex flex-col bg-neutral-50">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto py-8 flex flex-col gap-2">
        <div className="max-w-2xl w-full mx-auto flex flex-col gap-3 px-2 md:px-0">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative px-4 py-2 max-w-[80%] shadow-sm
                  ${msg.from === "user"
                    ? "bg-blue-600 text-white rounded-2xl rounded-br-md"
                    : "bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md"
                  }`}
                style={{
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  fontSize: "1rem",
                  lineHeight: "1.5"
                }}
              >
                {/* Render AI (bot) messages as Markdown, user as plain text */}
                {msg.from === "bot" ? (
                  <>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {/* Copy button for AI responses */}
                    <button
                      className="absolute top-2 right-2 text-blue-500 hover:text-blue-700 bg-white/80 rounded p-1 border border-blue-100 shadow-sm transition"
                      style={{ fontSize: "1rem" }}
                      onClick={() => handleCopy(msg.text, idx)}
                      title="Copy to clipboard"
                    >
                      {copiedIdx === idx ? (
                        <span className="text-xs text-green-600 font-semibold">✓</span>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <rect x="3" y="3" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
                        </svg>
                      )}
                    </button>
                  </>
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {/* Typing animation for AI */}
          {typingText && (
            <div className="flex justify-start">
              <div className="px-4 py-2 max-w-[80%] shadow-sm bg-white text-gray-900 border border-gray-200 rounded-2xl rounded-bl-md" style={{ fontSize: "1rem", lineHeight: "1.5" }}>
                <ReactMarkdown>{typingText}</ReactMarkdown>
                <span className="animate-pulse">|</span>
              </div>
            </div>
          )}
          {/* Loading indicator */}
          {loading && !typingText && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-white text-gray-400 border border-gray-200 shadow-sm">
                AI is typing...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="w-full flex items-center gap-2 px-4 py-4 bg-white border-t border-gray-200"
        style={{ boxShadow: "0 -2px 8px 0 rgba(0,0,0,0.02)" }}
      >
        <input
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-neutral-100"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={userType === "tenant"
            ? "Ask a question about renting or your tenancy..."
            : "Ask a question about property management..."}
          disabled={loading || !!typingText}
          autoFocus
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
          disabled={loading || !!typingText}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AI;
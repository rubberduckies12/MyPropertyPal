import React, { useState } from "react";
import axios from "axios";

// System prompt for landlord-specific AI assistant
const systemPrompt =
  "You are a helpful assistant for property landlords. Only answer questions related to property management, rentals, tenants, and landlord topics. If asked about anything else, politely refuse.";

/**
 * LandlordChatbot
 * Simple AI chatbot for landlords to ask property-related questions.
 */
const LandlordChatbot = () => {
  // -------------------- State --------------------
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I am your AI assistant. Ask me anything about property management." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------- Handlers --------------------
  // Handle sending a message to the AI
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Call OpenAI API directly (for demo) - replace with your backend endpoint for production!
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m) => ({
              role: m.from === "user" ? "user" : "assistant",
              content: m.text,
            })),
            { role: "user", content: input },
          ],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`, // Replace with your actual API key or use a backend proxy
            "Content-Type": "application/json",
          },
        }
      );
      const aiText = res.data.choices[0].message.content;
      setMessages((msgs) => [...msgs, { from: "bot", text: aiText }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Sorry, I couldn't process your request." },
      ]);
    }
    setLoading(false);
  };

  // -------------------- Render --------------------
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 flex flex-col h-[70vh]">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">AI Property Chatbot</h2>
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-400">
                AI is typing...
              </div>
            </div>
          )}
        </div>
        {/* Input area */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a property question..."
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold transition"
            disabled={loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default LandlordChatbot;
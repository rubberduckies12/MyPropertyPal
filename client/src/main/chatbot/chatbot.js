const API_URL = "https://mypropertypal-3.onrender.com/api/chatbot"; // or your actual endpoint

export async function fetchChatbotReply(chatHistory) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history: chatHistory }),
  });
  const data = await response.json();
  return data.reply;
}
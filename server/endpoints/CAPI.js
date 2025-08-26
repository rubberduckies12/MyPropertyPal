const PIXEL_ID = process.env.FB_PIXEL_ID;
const ACCESS_TOKEN = process.env.FB_CAPI_TOKEN;

async function sendEvent(eventName, email, customData = {}) {
  // In production, hash email using SHA256
  const payload = {
    data: [
      {
        event_name: eventName, // Dynamic event name
        event_time: Math.floor(Date.now() / 1000),
        user_data: {
          em: [email], // hashed with SHA256 in production
        },
        custom_data: customData, // Dynamic custom data
        action_source: "website",
      },
    ],
    access_token: ACCESS_TOKEN,
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${PIXEL_ID}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("CAPI Response:", data);
  } catch (err) {
    console.error("CAPI error:", err);
  }
}

module.exports = { sendEvent };

const jwt = require("jsonwebtoken");

async function generateAdminAuthToken(adminId) {
  try {
    const expiresIn = "1h"; // Token expiration time
    const token = jwt.sign(
      {
        id: adminId, // Admin ID
        role: "admin", // Explicitly set the role as admin
      },
      process.env.AUTH_TOKEN_KEY, // Secret key from environment variables
      {
        expiresIn: expiresIn, // Token expiration
      }
    );

    return token;
  } catch (err) {
    console.error("Error generating admin auth token:", err);
    throw new Error("Failed to generate admin authentication token");
  }
}

module.exports = generateAdminAuthToken;
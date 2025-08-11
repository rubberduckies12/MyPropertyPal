const jwt = require("jsonwebtoken");

async function authenticate(req, res, next) {
  try {
    console.log(`Authenticate middleware called for route: ${req.path}`);

    // Exclude public routes and /webhook
    const excludedRoutes = [
      "/register",
      "/login",
      "/api/tenants/invite/:token",
      "/webhook",
      "/api/admin/adminlogin", // Exclude admin login route
    ];
    if (excludedRoutes.some((route) => req.originalUrl.startsWith(route))) {
      return next();
    }

    // Read JWT from cookie
    const token = req.cookies.token || req.cookies.admin_token; // Check both user and admin tokens
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.AUTH_TOKEN_KEY, async (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      const pool = req.app.get("pool");

      // Check if the token is for an admin
      if (payload.role === "admin") {
        // Attach admin details to the request
        const result = await pool.query(
          "SELECT id, email, first_name, last_name FROM admin_account WHERE id = $1",
          [payload.id]
        );

        if (result.rows.length === 0) {
          return res.status(401).json({ error: "Unauthorized: Admin not found" });
        }

        req.admin = result.rows[0]; // Attach admin details to the request
        return next();
      }

      // If not an admin, assume it's a user token
      req.user = payload;

      // Attach landlord_id if this is a landlord account
      const result = await pool.query(
        "SELECT id FROM landlord WHERE account_id = $1",
        [payload.id]
      );
      if (result.rows.length) {
        req.user.landlord_id = result.rows[0].id;
      }

      next();
    });
  } catch (err) {
    console.error("Error in authenticate middleware:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = authenticate;
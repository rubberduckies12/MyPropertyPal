const express = require("express");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/adminregister", async (req, res) => {
  const { email, password, pin_number, first_name, last_name } = req.body;
  const pool = req.app.get("pool"); // Get the pool from the app instance

  if (!email || !password || !pin_number || !first_name || !last_name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (pin_number.length !== 4 || isNaN(pin_number)) {
    return res.status(400).json({ error: "PIN number must be a 4-digit number." });
  }

  try {
    // Check if the email already exists
    const existingAdmin = await pool.query(
      "SELECT id FROM admin_account WHERE email = $1",
      [email]
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new admin into the database with is_approved set to false
    const result = await pool.query(
      `INSERT INTO admin_account (email, password_hash, pin_number, first_name, last_name, is_approved)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [email, hashedPassword, pin_number, first_name, last_name, false]
    );

    const adminId = result.rows[0].id;

    // Send an email to tommy.rowe@mypropertypal.com for approval
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use your email service
      auth: {
        user: process.env.EMAIL_USER, // Sender email address from environment variables
        pass: process.env.EMAIL_PASS, // Email password or app-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender email address from environment variables
      to: "tommy.rowe.dev@gmail.com",
      subject: "New Admin Registration Approval Required",
      text: `A new admin has registered and requires approval:
      
      Name: ${first_name} ${last_name}
      Email: ${email}
      PIN: ${pin_number}

      Please log in to the admin panel to approve or reject this registration.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      message: "Registration successful. Awaiting approval.",
      adminId,
    });
  } catch (err) {
    console.error("Error during admin registration:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
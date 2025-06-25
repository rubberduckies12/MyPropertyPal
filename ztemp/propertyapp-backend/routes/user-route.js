const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Helper to generate a unique 6-digit userId
async function generateUniqueUserId() {
  let userId, exists;
  do {
    userId = Math.floor(100000 + Math.random() * 900000).toString();
    exists = await User.findOne({ userId });
  } while (exists);
  return userId;
}

// User registration route
router.post('/register', async (req, res) => {
  try {
    // If registering as tenant, validate linkedLandlordId
    if (req.body.role === 'tenant') {
      const landlord = await User.findOne({ userId: req.body.linkedLandlordId, role: 'landlord' });
      if (!landlord) {
        return res.status(400).json({ error: 'Invalid landlord userId.' });
      }
    }

    const userId = await generateUniqueUserId();
    const saltRounds = 10;
    // Hash the provided plain-text password.
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create the user, storing the hashed password and verificationToken
    const user = new User({
      ...req.body,
      userId,
      passwordHash: hashedPassword,
      verified: false,
      verificationToken
    });
    await user.save();

    // Build the verification link for the email
    const verifyUrl = `http://localhost:5173/verify-email?token=${verificationToken}`;

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
    });

    res.status(201).json({
      _id: user._id, // <-- add this line
      userId: user.userId,
      role: user.role,
      email: user.email,
      name: user.name
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    // Block login if not verified
    if (!user.verified) {
      return res.status(403).json({ error: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.userId, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        _id: user._id, // <-- add this line
        userId: user.userId,
        role: user.role,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get users relevant to the authenticated user (PROTECTED)
router.get('/', auth, async (req, res) => {
  try {
    // Debug: Confirm route is hit
    console.log("GET /api/users route hit");

    // Ensure user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find the current user
    const currentUser = await User.findOne({ userId: req.user.userId });
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Landlord: return only their tenants
    if (currentUser.role === 'landlord') {
      const tenants = await User.find({
        role: 'tenant',
        linkedLandlordId: currentUser.userId
      });
      console.log("Landlord userId:", currentUser.userId);
      console.log("Tenants found:", tenants.length);
      return res.json(tenants);
    }

    // Tenant: return only their own info
    if (currentUser.role === 'tenant') {
      return res.json([currentUser]);
    }

    // Default: return empty array for other roles
    return res.json([]);
  } catch (err) {
    console.error("Error in GET /api/users:", err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Get tenant count for the logged-in landlord
router.get('/tenantCount', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const currentUser = await User.findOne({ userId: req.user.userId });
    if (!currentUser || currentUser.role !== 'landlord') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const count = await User.countDocuments({
      role: 'tenant',
      linkedLandlordId: currentUser.userId
    });

    // Add this line:
    console.log(`Tenant count for landlord ${currentUser.userId}:`, count);

    return res.json({ tenantCount: count });
  } catch (err) {
    console.error("Error in GET /api/users/tenantCount:", err);
    res.status(500).json({ error: 'Server error.' });
  }
});

// Update a user by userId
router.patch('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user by userId
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ userId: req.params.userId });
    if (!user) return res.status(404).json({ error: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// TEMP: Delete all users (for testing only, remove in production!)
router.delete('/all', async (req, res) => {
  try {
    await User.deleteMany({});
    res.json({ message: 'All users deleted.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token });
  if (!user) return res.status(400).send('Invalid or expired token');
  user.verified = true;
  user.verificationToken = undefined;
  await user.save();
  res.send('Email verified! You can now log in.');
});

// --- RESET PASSWORD FEATURE ---

// 1. Request password reset (send email with token)
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.json({ message: 'If this email exists, a reset link has been sent.' });
    }

    // Generate a reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email with reset link
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    });

    res.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Error sending reset email.' });
  }
});

// 2. Reset password using token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token.' });
    }

    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(password, saltRounds);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password has been reset. You can now log in.' });
  } catch (err) {
    res.status(500).json({ error: 'Error resetting password.' });
  }
});

// Change password route (PROTECTED)
router.post('/change-password', auth, async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const user = await User.findOne({ userId });
    if (!user) return res.status(404).json({ error: 'User not found.' });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect.' });

    // Update password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a user by userId
router.get('/:userId', async (req, res) => {
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json(user);
});

module.exports = router;
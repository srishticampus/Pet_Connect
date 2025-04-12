import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js"; // Assuming this middleware verifies JWT for protected routes if needed later
import User from "../../models/user.js";
import crypto from "crypto";
import { sendEmail } from "../../services/email.js"; // Assuming this service is configured

export const router = express.Router();
const refreshTokens = new Map();

// Generate CSRF token
const generateCSRFToken = () => crypto.randomBytes(32).toString('hex');

// --- Registration ---
// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Role is required").isIn([
      "adopter",
      "foster",
      "rescue",
      "admin",
      "pet_owner",
    ]),
    // Add more validation based on role if needed, e.g., certificate for rescue
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, ...otherFields } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        role,
        ...otherFields, // Include any other fields passed for specific roles
      });

      // Encrypt password
      user.password = await argon2.hash(password);

      await user.save();

      // Return user data (excluding password) - no token on register, user must login
      const userResponse = user.toJSON(); // Use the transform to remove password

      res.status(201).json(userResponse);

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


// --- Login ---
// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  [
    check("email", "Valid email required").isEmail(),
    check("password", "Password required").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user || !await argon2.verify(user.password, req.body.password)) {
        return res.status(401).json({ msg: "Invalid credentials" });
      }

      // Update last login time
      user.lastLogin = Date.now();
      await user.save();

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' } // Short-lived access token
      );

      const refreshToken = crypto.randomBytes(64).toString('hex');
      const csrfToken = generateCSRFToken();

      // Store refresh token securely (in-memory map used here, consider a persistent store like Redis for production)
      refreshTokens.set(refreshToken, {
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity for refresh token
        csrfToken // Associate CSRF token with refresh token
      });

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true, // Prevent client-side JS access
        secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
        sameSite: 'strict', // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // Match refresh token validity
      });

      // Set CSRF token cookie (accessible by client-side JS)
      res.cookie('XSRF-TOKEN', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
        // No httpOnly, as it needs to be read by the client to be sent in headers
      });

      res.json({
        accessToken,
        user: { id: user.id, email: user.email, role: user.role } // Send back essential user info
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// --- Refresh Token ---
// @route   POST api/auth/refresh
// @desc    Refresh access token using refresh token
// @access  Public (requires refresh token cookie)
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const clientCsrfToken = req.headers['x-xsrf-token']; // Standard header for CSRF token

  if (!refreshToken) return res.status(401).json({ msg: "Unauthorized: No refresh token" });
  if (!clientCsrfToken) return res.status(401).json({ msg: "Unauthorized: No CSRF token header" });


  try {
    const tokenData = refreshTokens.get(refreshToken);

    // Validate refresh token existence, expiry, and CSRF token match
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      refreshTokens.delete(refreshToken); // Clean up expired/invalid token
      return res.status(401).json({ msg: "Invalid or expired refresh token" });
    }
    if (tokenData.csrfToken !== clientCsrfToken) {
        return res.status(403).json({ msg: "Forbidden: Invalid CSRF token" });
    }


    const user = await User.findById(tokenData.userId);
    if (!user) {
        refreshTokens.delete(refreshToken); // Clean up if user doesn't exist anymore
        return res.status(401).json({ msg: "User not found" });
    }

    // Issue new access token
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Optionally rotate refresh token and CSRF token for enhanced security
    // For simplicity, we are reusing the refresh token but generating a new CSRF token
    const newCsrfToken = generateCSRFToken();
    refreshTokens.set(refreshToken, {
      ...tokenData,
      csrfToken: newCsrfToken // Update the stored CSRF token
    });

    // Send back the new CSRF token via cookie
    res.cookie('XSRF-TOKEN', newCsrfToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.json({ accessToken: newAccessToken });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// --- Logout ---
// @route   POST api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Public (requires refresh token cookie)
router.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    refreshTokens.delete(refreshToken); // Remove token from store
  }

  // Clear cookies
  res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
  res.clearCookie('XSRF-TOKEN', { secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

  res.json({ msg: "Logged out successfully" });
});


// --- Forgot Password ---
// @route   POST api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post(
  "/forgot-password",
  [check("email", "Please include a valid email").isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        // Important: Don't reveal if the user exists or not for security reasons
        return res.status(200).json({ msg: "If an account with that email exists, a password reset link has been sent." });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(20).toString("hex");

      // Set token and expiry on user model
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex"); // Store hashed token
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

      await user.save();

      // Create reset URL (adjust CLIENT_URL as needed, maybe from env vars)
      const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`; // Use the raw token in the URL

      const message = `
        You are receiving this email because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        ${resetUrl}
        If you did not request this, please ignore this email and your password will remain unchanged.
        This link will expire in 1 hour.
      `;

      try {
        await sendEmail({
          to: user.email,
          subject: "PetConnect Password Reset Request",
          text: message,
        });

        res.status(200).json({ msg: "Password reset email sent." });
      } catch (emailErr) {
        console.error("Email sending error:", emailErr);
        // Clear the token if email fails to prevent unusable tokens
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(500).send("Error sending password reset email.");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// --- Reset Password ---
// @route   POST api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.post(
  "/reset-password/:token",
  [
    check(
      "password",
      "Please enter a new password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Hash the token from the URL parameter to match the stored hashed token
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

      // Find user by hashed token and check expiry
      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }, // Check if token is not expired
      });

      if (!user) {
        return res.status(400).json({ msg: "Password reset token is invalid or has expired." });
      }

      // Set the new password
      user.password = await argon2.hash(req.body.password);
      // Clear the reset token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save();

      // Optionally: Log the user in automatically or send a confirmation email
      // For now, just confirm success
      res.status(200).json({ msg: "Password has been reset successfully." });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

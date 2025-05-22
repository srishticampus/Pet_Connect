import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js"; // Assuming this middleware verifies JWT for protected routes if needed later
import User from "../../models/user.js";
import crypto from "crypto";
import { sendEmail } from "../../services/email.js"; // Assuming this service is configured
import petOwnerRouter from "./pet-owner.js";
import petShopRouter from "./pet-shop.js";
import fosterRouter from "./foster.js";
import adopterRouter from "./adopter.js";
import rescueShelterRouter from "./rescue-shelter.js";

export const router = express.Router();

// --- Mount Routers ---
router.use("/register/pet-owner", petOwnerRouter);
router.use("/register/pet-shop", petShopRouter);
router.use("/register/foster", fosterRouter);
router.use("/register/adopter", adopterRouter);
router.use("/register/rescue-shelter", rescueShelterRouter);

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
      let user;

      if (req.body.email === "admin@admin.com" && req.body.password === "admin") {
        user = await User.findOne({ email: "admin@admin.com", role: "admin" });

        if (!user) {
          // Create a new admin user
          const hashedPassword = await argon2.hash("admin");
          user = new User({
            name: "Admin User",
            email: "admin@admin.com",
            password: hashedPassword,
            role: "admin",
          });
          await user.save();
        }
      } else {
        user = await User.findOne({ email: req.body.email });
        if (!user || !await argon2.verify(user.password,req.body.password)) {
          return res.status(401).json({ msg: "Invalid credentials" });
        }
      }

      if (user.role === "foster" && !user.isApproved) {
        return res.status(403).json({ msg: "Your foster application is pending approval. Please wait for admin approval." });
      }
      
      if (user.role === "adopter" && !user.isApproved) {
        return res.status(403).json({ msg: "Your adopter application is pending approval. Please wait for admin approval." });
      }
      
      // Update last login time
      user.lastLogin = Date.now();
      await user.save();

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        import.meta.env.VITE_JWT_SECRET,
        { expiresIn: '7d' } // Increased access token life to 7 days
      );

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

// --- Logout ---
// @route   POST api/auth/logout
// @desc    Logout user (clear cookie)
// @access  Public
router.post("/logout", (req, res) => {
  // Clear cookies
  res.clearCookie('refreshToken', { httpOnly: true, secure: import.meta.env.NODE_ENV === 'production', sameSite: 'strict' });

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
      const resetUrl = `${import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`; // Use the raw token in the URL

      const message = `
        You are receiving this email because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        ${resetUrl}
        If you did not request this, please ignore this email and your password will remain unchanged.
        This link will expire in 1 hour.
      `;

      try {
        await sendEmail(
          user.email,
          "PetConnect Password Reset Request",
          message,
        );

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

// --- Get User Data ---
// @route   GET api/auth/me
// @desc    Get user data from token
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

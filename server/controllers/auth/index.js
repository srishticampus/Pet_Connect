import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import auth from "../../middleware/auth.js";
import User from "../../models/user.js";
import crypto from "crypto";
import { sendEmail } from "../../services/email.js";

export const router = express.Router();
const refreshTokens = new Map();

// Generate CSRF token
const generateCSRFToken = () => crypto.randomBytes(32).toString('hex');

// @route   POST api/auth/login
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

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );
      
      const refreshToken = crypto.randomBytes(64).toString('hex');
      const csrfToken = generateCSRFToken();

      // Store refresh token
      refreshTokens.set(refreshToken, { 
        userId: user.id,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        csrfToken
      });

      // Set cookies
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      
      res.cookie('XSRF-TOKEN', csrfToken, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.json({ 
        accessToken,
        user: { id: user.id, email: user.email, role: user.role }
      });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/refresh
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const tokenData = refreshTokens.get(refreshToken);
    if (!tokenData || tokenData.expiresAt < Date.now()) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    const user = await User.findById(tokenData.userId);
    if (!user) return res.status(401).json({ msg: "User not found" });

    // Issue new tokens
    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const newCsrfToken = generateCSRFToken();
    refreshTokens.set(refreshToken, { 
      ...tokenData, 
      csrfToken: newCsrfToken
    });

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

// @route   POST api/auth/logout
router.post("/logout", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) refreshTokens.delete(refreshToken);
  
  res.clearCookie('refreshToken');
  res.clearCookie('XSRF-TOKEN');
  res.json({ msg: "Logged out successfully" });
});

// Existing register, forgot-password, reset-password endpoints remain 
// with updated security practices as needed

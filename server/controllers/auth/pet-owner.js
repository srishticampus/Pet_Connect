import express from "express";
import argon2 from "argon2";
import { check, validationResult } from "express-validator";
import User from "../../models/user.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// User registration endpoint
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid email required").isEmail(),
    check("newPassword", "Password must be 6+ characters").isLength({ min: 6 }),
    check("phoneNumber", "Phone number required").not().isEmpty(),
    check("address", "Address required").not().isEmpty(),
    check("aadhaarNumber", "Aadhaar number required").not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    if (req.body.email === "admin@admin.com") {
      return res.status(400).json({ error: "This email is not allowed" });
    }

    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).json({ error: "User already exists" });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        aadhaarNumber: req.body.aadhaarNumber,
        role: "pet_owner",
        password: await argon2.hash(req.body.newPassword)
      });

      const savedUser = await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        userId: savedUser._id
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Server error during registration" });
    }
  }
);

// Image upload endpoint
router.post(
  "/:userId/images",
  fileUpload({ createParentPath: true }),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Handle profile picture
      if (req.files?.profilePic) {
        const file = req.files.profilePic;
        const filename = `${Date.now()}_${file.name}`;
        const filePath = path.join(__dirname, '../../uploads/profile_pictures', filename);
        await file.mv(filePath);
        user.profilePic = `/uploads/profile_pictures/${filename}`;
      }

      // Handle Aadhaar image
      if (req.files?.aadhaarImage) {
        const file = req.files.aadhaarImage;
        const filename = `${Date.now()}_${file.name}`;
        const filePath = path.join(__dirname, '../../uploads/aadhaar', filename);
        await file.mv(filePath);
        user.aadhaarImage = `/uploads/aadhaar/${filename}`;
      }

      await user.save();
      res.json({ // Success response after successful image upload
        message: "Images uploaded successfully",
        user: user.toJSON()
      });

    } catch (error) {
      console.error("Image upload error:", error);
      // Log the error and send a success response indicating image upload failed
      // Ensure user is defined here before sending the response.
      // If findById succeeded, user will be defined.
      // The user object will not have the image paths assigned in case of upload failure.
      const user = await User.findById(req.params.userId); // Re-fetch user to ensure it's defined
      if (!user) {
         // This case should ideally not happen if findById succeeded before the try block,
         // but as a fallback
         return res.status(500).json({ error: "User not found after image upload attempt" });
      }
      res.json({
        message: "Registration successful (image upload failed)", // Modified message
        user: user.toJSON() // user should be defined here
      });
    }
  }
);

export default router;
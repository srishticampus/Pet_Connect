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

// @route   POST api/auth/register/pet-shop
// @desc    Register pet shop
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "newPassword",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phoneNumber", "Phone number is required").not().isEmpty(),
    check("shopName", "Shop name is required").not().isEmpty(),
    check("registrationId", "Registration ID is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    if (req.body.email === "admin@admin.com") {
      return res.status(400).json({ error: "This email is not allowed" });
    }

    const { name, email, newPassword, phoneNumber, shopName, registrationId, address } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Create a new user object with the data from the JSON request
      user = new User({
        name,
        email,
        phoneNumber,
        shopName,
        registrationId,
        address,
        role: "pet_shop",
      });

      // Encrypt password
      user.password = await argon2.hash(newPassword);

      // Store the user object in the request for the /images route to use
      req.user = user;
      req.user.password = user.password; // Assign the encrypted password

      try {
        await user.save();
        // Respond with a success message and the user ID
        res.status(200).json({ msg: "User data received, awaiting images...", userId: user.id });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/register/pet-shop/images
// @desc    Upload images for pet shop registration
// @access  Public
router.post(
  "/images",
  fileUpload({ createParentPath: true }), // Ensure uploads directory exists
  async (req, res) => {
    if (!req.user) {
      return res.status(400).json({ msg: "User data not received. Please submit user data first." });
    }

    let user = req.user;

    let profilePic = null;
    if (req.files && req.files.profilePic) {
      const profilePicFile = req.files.profilePic;
      const profilePicFileName = `${Date.now()}_${profilePicFile.name}`;
      const profilePicUploadPath = path.join(__dirname, '../../uploads/profile_pictures', profilePicFileName);
      try {
        await profilePicFile.mv(profilePicUploadPath);
        profilePic = `/uploads/profile_pictures/${profilePicFileName}`;
        user.profilePic = profilePic; // Assign the profile picture path to the user object
      } catch (err) {
        console.error("Profile picture upload failed:", err);
        // Log the error but continue with registration success
        // The user object will not have the profile_picture path assigned
      }
    }

    try {
      // Return user data (excluding password) - no token on register, user must login
      const userResponse = user.toJSON(); // Use the transform to remove password

      res.status(201).json(userResponse);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
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

// @route   POST api/auth/register/rescue-shelter
// @desc    Register rescue-shelter
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
    check("address", "Place is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, newPassword, phoneNumber, address } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      if (req.body.email === "admin@admin.com") {
        return res.status(400).json({ error: "This email is not allowed" });
      }

      // Create a new user object with the data from the JSON request
      user = new User({
        name,
        email,
        phoneNumber,
        address,
        role: "rescue-shelter",
      });

      // Encrypt password
      user.password = await argon2.hash(newPassword);

      try {
        await user.save();
        // Store the user object in the request for the /images route to use
        req.user = user;
        req.user.password = user.password; // Assign the encrypted password

        // Respond with a success message and the user ID
        return res.status(200).json({ msg: "User data received, awaiting images...", userId: user.id });
      } catch (err) {
        console.error(err.message);
        return res.status(500).send("Server error");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/register/rescue-shelter/images
// @desc    Upload images for rescue-shelter registration
// @access  Public
router.post(
  "/:userId/images",
  fileUpload({ createParentPath: true }), // Ensure uploads directory exists
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Handle profile picture
      if (req.files?.profilePic) {
        const file = req.files.profilePic;
        const filename = `${Date.now()}_${file.name}`;
        const filePath = path.join(__dirname, '../../uploads/profile_pictures', filename);
        await file.mv(filePath);
        user.profilePic = `/uploads/profile_pictures/${filename}`;
      }

      // Handle Certificate upload (optional)
      if (req.files?.certificate) {
        const file = req.files.certificate;
        const filename = `${Date.now()}_${file.name}`;
        const filePath = path.join(__dirname, '../../uploads/certificates', filename);
        await file.mv(filePath);
        user.certificate = `/uploads/certificates/${filename}`;
      }

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


export default router;

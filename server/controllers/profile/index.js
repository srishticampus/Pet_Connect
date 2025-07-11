import express from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/user.js";
import multer from 'multer'; // Import multer
import path from 'path'; // Import path module
import { fileURLToPath } from 'url'; // Import fileURLToPath
import fs from 'fs'; // Import fs module

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the destination directory for profile pictures
    const uploadPath = path.join(__dirname, '../../uploads/profile_pictures');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Define the file name (e.g., userId + original extension)
    cb(null, req.userId + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// @route   GET api/profile
// @desc    Get user profile
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the user is an admin
    if (user.role === 'admin') {
      return res.status(403).json({ msg: "Admins do not have a profile page" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile
// @desc    Update user profile
// @access  Private
router.put("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the user is an admin
    if (user.role === 'admin') {
      return res.status(403).json({ msg: "Admins do not have a profile page" });
    }

    // Update user fields
    // Email validation and update
    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ msg: "Please enter a valid email address." });
      }

      // Check for email uniqueness only if email is being changed
      if (req.body.email !== user.email) {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
          return res.status(400).json({ msg: "Email already registered." });
        }
      }
      user.email = req.body.email;
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.address) user.address = req.body.address;
    // profilePic is handled by a separate route, so no need to update here
    // if (req.body.profilePic) user.profilePic = req.body.profilePic;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/profile/picture
// @desc    Update user profile picture
// @access  Private
router.put("/picture", auth, upload.single('profilePic'), async (req, res) => {
  try {
    // req.file contains information about the uploaded file
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the user is an admin (Admins don't have profile pictures in this context)
    if (user.role === 'admin') {
       // Optionally delete the uploaded file if it's an admin trying to upload
       // fs.unlink(req.file.path, (err) => { if (err) console.error('Error deleting admin profile pic upload:', err); });
      return res.status(403).json({ msg: "Admins do not have a profile page" });
    }

    // Update the profilePic field with the file path
    // Store path relative to the server root or a public directory if serving static files
    user.profilePic = `/uploads/profile_pictures/${req.file.filename}`; // Adjust path as needed for serving

    await user.save();

    res.json({ profilePic: user.profilePic }); // Return the new profile picture URL
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


export { router };

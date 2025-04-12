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

// Enable file upload
router.use(fileUpload());

// @route   POST api/auth/register/pet-owner
// @desc    Register pet owner
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("phoneNumber", "Phone number is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("aadhaarNumber", "Aadhaar number is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNumber, address, aadhaarNumber, profilePic } = req.body;

    // Handle aadhaarImage upload
    let aadhaarImage;
    if (req.files && req.files.aadhaarImage) {
      aadhaarImage = req.files.aadhaarImage;
      const fileName = `${Date.now()}_${aadhaarImage.name}`;
      const uploadPath = path.join(__dirname, '../../../client/public/uploads', fileName); // Store in client/public/uploads
      try {
        await aadhaarImage.mv(uploadPath);
        aadhaarImage = `/uploads/${fileName}`; // Store the relative path in the database
      } catch (err) {
        console.error(err);
        return res.status(500).send("File upload failed");
      }
    }

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
        phoneNumber,
        address,
        aadhaarNumber,
        profile_picture: profilePic,
        aadhaarImage: aadhaarImage,
        role: "pet_owner",
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

export default router;
import express from "express";
import argon2 from "argon2";
import { check, validationResult } from "express-validator";
import User from "../../models/user.js";

const router = express.Router();

// @route   POST api/auth/register/volunteer
// @desc    Register volunteer
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
    check("username", "Username is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phoneNumber, username, address, profilePic } = req.body;

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
        username,
        email,
        password,
        phoneNumber,
        address,
        profile_picture: profilePic,
        role: "volunteer",
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
import express from "express";
import auth from "../../middleware/auth.js";
import User from "../../models/user.js";

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

    // Update user fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
    if (req.body.address) user.address = req.body.address;
    if (req.body.profile_picture) user.profile_picture = req.body.profile_picture;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
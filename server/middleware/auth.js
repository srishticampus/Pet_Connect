import jwt from "jsonwebtoken";
import User from '../models/user'; // Import User model

const auth = async (req, res, next) => {
  // Get token from header
  let token = req.header("x-auth-token");
  // or from bearer token
  if (!token) {
    token = req.header("Authorization")?.split(" ")[1];
  }
  // Check if token is in the body
  if (!token) {
    token = req.body.token;
  }

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, import.meta.env.VITE_JWT_SECRET);
    req.userId = decoded.userId; // Keep req.userId

    // Fetch the user from the database
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(401).json({ msg: "User not found, authorization denied" });
    }

    req.user = user; // Attach the user object to the request
    req.userType = user.role; // Attach the user type to the request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  gender: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  profile_picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["adopter", "foster", "rescue", "admin", "pet_owner"],
    default: "adopter",
  },
  aadhaarNumber: {
    type: String,
  },
  certificate: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  // Fields for password reset
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", UserSchema);

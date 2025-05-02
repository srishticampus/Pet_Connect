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
  address: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  role: {
    type: String,
    enum: ["adopter", "foster", "rescue-shelter", "admin", "pet_owner", "pet_shop"],
    default: "adopter",
  },
  aadhaarNumber: {
    type: String,
  },
  aadhaarImage: {
    type: String,
  },
  certificate: {
    type: String,
  },
  shopName: {
    type: String,
  },
  registrationId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
  isApproved: {
    type: Boolean,
    default: false,
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

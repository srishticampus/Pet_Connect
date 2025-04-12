import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  // Link to the primary user managing this organization (likely role 'rescue' or 'admin')
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  contact: { // Could be phone, email, etc.
    type: String,
    required: true,
    trim: true,
  },
  // Verification status managed by platform admins
  verified: {
    type: Boolean,
    default: false,
  },
  // Pets associated with this organization
  pets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
  }],
  // Applications received by this organization
  applications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the 'updatedAt' field on save
organizationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Organization", organizationSchema);
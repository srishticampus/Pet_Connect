import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
    required: true,
  },
  owner: { // The owner managing the pet (rescue/shelter or individual pet owner)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming owner can be a User (pet owner) or Organization
    required: true,
  },
  applicationType: {
    type: String,
    enum: ["adoption", "foster"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "withdrawn"],
    default: "pending",
  },
  message: { // Optional message from the applicant
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Fields for review process
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Admin or rescue user who reviewed
  },
  reviewDate: {
    type: Date,
  },
  reviewNotes: {
    type: String,
  }
});

// Middleware to update the 'updatedAt' field on save
applicationSchema.pre('save', function(next) {
  if (this.isModified()) {
      this.updatedAt = Date.now();
  }
  next();
});

// Indexing for faster queries
applicationSchema.index({ applicant: 1, status: 1 });
applicationSchema.index({ organization: 1, status: 1 });
applicationSchema.index({ pet: 1, status: 1 });


export default mongoose.model("Application", applicationSchema);
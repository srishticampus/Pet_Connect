import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportType: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  // Fields relevant for 'lost' reports
  petName: {
    type: String,
    trim: true,
    // Required only if reportType is 'lost'
    required: function() { return this.reportType === 'lost'; }
  },
  lastSeenLocation: {
    type: String,
    trim: true,
    // Required only if reportType is 'lost'
    required: function() { return this.reportType === 'lost'; }
  },
  // Fields relevant for 'found' reports
  foundLocation: {
    type: String,
    trim: true,
    // Required only if reportType is 'found'
    required: function() { return this.reportType === 'found'; }
  },
  // Common fields
  petDescription: { // Can be used for description in both lost/found cases
    type: String,
    required: true,
    trim: true,
  },
  image: { // URL or path to the pet's image
    type: String,
  },
  status: { // Status of the report (e.g., open, resolved, closed)
    type: String,
    enum: ["open", "resolved", "closed"],
    default: "open",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  // Optional: Link to the actual Pet record if identified/matched
  matchedPet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
    default: null,
  }
});

// Middleware to update the 'updatedAt' field on save
reportSchema.pre('save', function(next) {
  if (this.isModified()) {
      this.updatedAt = Date.now();
  }
  next();
});

// Indexing for faster queries
reportSchema.index({ reportingUser: 1, status: 1 });
reportSchema.index({ reportType: 1, status: 1 });
reportSchema.index({ lastSeenLocation: "text", foundLocation: "text", petDescription: "text" }); // For text search

export default mongoose.model("Report", reportSchema);
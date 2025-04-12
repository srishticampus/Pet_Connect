import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  Photo: {
    type: String,
  },
  Species: {
    type: String,
    required: true,
  },
  Breed: {
    type: String,
  },
  Size: {
    type: String,
    enum: ["small", "medium", "large"],
  },
  Age: {
    type: Number,
  },
  Gender: {
    type:String,
    enum: ["male", "female", "other"],
    default: "other",
  },
  HealthStatus: {
    vaccinated: {
      type: String,
      enum: ["fully vaccinated", "partially vaccinated", "unvaccinated", "unknown"],
      default: "unknown",
    },
    spayed: {
      type: Boolean,
    },
    microchipped: {
      type: Boolean,
    },
  },
  Location: { // Consider making this more structured (e.g., GeoJSON) later
    type: String,
  },
  Origin: {
    type: String, // "lost/found", "rescue/shelter", "foster"
    enum: ["lost/found", "rescue/shelter", "foster"],
  },
  // Renamed from Rescue and updated ref
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Reference to the Organization model
  },
  // Added timestamps
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
petSchema.pre('save', function(next) {
  if (this.isModified()) {
      this.updatedAt = Date.now();
  }
  next();
});

// Indexing for common search fields
petSchema.index({ Species: 1, Breed: 1, Size: 1, Age: 1 });
petSchema.index({ organization: 1 });
petSchema.index({ Location: "text" }); // Basic text search on location

export default mongoose.model("Pets", petSchema);

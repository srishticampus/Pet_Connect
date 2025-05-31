import mongoose from "mongoose";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
  },
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
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
  },
  healthVaccinations: {
    type: [String], // Array of strings
  },
  Location: { // Consider making this more structured (e.g., GeoJSON) later
    type: String,
  },
  petOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (Pet Owner)
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model (Rescue Shelter or Foster)
  },
  origin: {
    type: String,
    enum: ["owner", "foster", "rescue-shelter"],
    required: true,
  },
  availableForAdoptionOrFoster: {
    type: Boolean,
    default: false,
  },
  isAdopted: { // New field to indicate if the pet has been adopted
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "lost", "found", "adopted", "fostered"],
    default: "active",
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
petSchema.index({ Location: "text" }); // Basic text search on location

export default mongoose.model("Pets", petSchema);

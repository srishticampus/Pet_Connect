import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["vet", "groomer", "trainer", "other"], // Added 'other' for flexibility
    required: true,
  },
  contact: { // Could be phone, email, website etc.
    type: String,
    required: true,
    trim: true,
  },
  location: { // Could be a full address or city/region
    type: String,
    required: true,
    trim: true,
  },
  // Optional fields
  description: {
    type: String,
    trim: true,
  },
  hoursOfOperation: {
    type: String, // Flexible format, e.g., "Mon-Fri 9am-5pm"
  },
  // Geospatial data for location-based search (optional but recommended)
  geoLocation: {
     type: {
       type: String,
       enum: ['Point'], // 'location.type' must be 'Point'
       // required: true // Uncomment if making geo-location mandatory
     },
     coordinates: {
       type: [Number], // [longitude, latitude]
       // required: true // Uncomment if making geo-location mandatory
     }
  },
  registeredBy: { // Admin user who added this service
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Assuming only admins can register services as per docs.md
  },
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
serviceSchema.pre('save', function(next) {
  if (this.isModified()) {
      this.updatedAt = Date.now();
  }
  next();
});

// Indexing for faster queries
serviceSchema.index({ type: 1 });
serviceSchema.index({ location: "text", name: "text", description: "text" }); // For text search
serviceSchema.index({ geoLocation: "2dsphere" }); // For geospatial queries

export default mongoose.model("Service", serviceSchema);
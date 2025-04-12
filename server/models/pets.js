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
  Location: {
    type: String,
  },
  Origin: {
    type: String, // "lost/found", "rescue/shelter", "foster"
    enum: ["lost/found", "rescue/shelter", "foster"],
  },
  Rescue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rescues", // Reference to the Rescue model
  },
});

export default mongoose.model("Pets", petSchema);

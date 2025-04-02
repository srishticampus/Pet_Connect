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
  },
  Age: {
    type: Number,
  },
  Temperament: {
    type: String,
  },
  HealthStatus: {
    type: String,
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

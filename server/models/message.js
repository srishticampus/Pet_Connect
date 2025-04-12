import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: { // Can be a User (adopter, foster, pet owner) or an Organization representative User
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  // Optional: Link message to a specific context if applicable
  relatedApplication: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    default: null,
  },
  relatedPet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pets",
    default: null,
  },
  relatedReport: { // For lost/found communication
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      default: null,
  },
  read: { // Indicates if the recipient has read the message
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Messages are generally immutable, but updatedAt might be useful for read status changes
  updatedAt: {
      type: Date,
      default: Date.now,
  }
});

// Middleware to update the 'updatedAt' field on save (e.g., when read status changes)
messageSchema.pre('save', function(next) {
  if (this.isModified()) {
      this.updatedAt = Date.now();
  }
  next();
});

// Indexing for faster retrieval of conversations
messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, read: 1, createdAt: -1 }); // For fetching unread messages

export default mongoose.model("Message", messageSchema);
// src/models/Mentor.ts
import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  expertise: [String], // Simplified array definition
  experience: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  languages: [String], // Simplified array definition
  achievements: [String], // Simplified array definition
  // New contact fields
  email: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  availability: {
    type: String,
    enum: ["available", "limited", "unavailable"],
    default: "available",
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Update timestamp on save
mentorSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes for better performance
mentorSchema.index({ user: 1 });
mentorSchema.index({ expertise: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ isActive: 1, availability: 1 });

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;

// src/models/Mentor.ts

import mongoose from "mongoose";

// Define the Mentor Schema with proper array types
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
  // Define expertise as an array of strings
  expertise: [
    {
      type: String,
      trim: true,
    },
  ],
  experience: {
    type: String,
    required: true,
  },
  education: {
    type: String,
    required: true,
  },
  // Define languages as an array of strings
  languages: [
    {
      type: String,
      trim: true,
    },
  ],
  // Define achievements as an array of strings
  achievements: [
    {
      type: String,
      trim: true,
    },
  ],
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

// Update timestamps on save
mentorSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Ensure arrays are properly initialized in toObject and toJSON methods
mentorSchema.methods.toObject = function () {
  const obj = mongoose.Model.prototype.toObject.apply(this, arguments);

  // Ensure arrays are properly initialized
  obj.expertise = Array.isArray(obj.expertise) ? obj.expertise : [];
  obj.languages = Array.isArray(obj.languages) ? obj.languages : [];
  obj.achievements = Array.isArray(obj.achievements) ? obj.achievements : [];

  return obj;
};

mentorSchema.methods.toJSON = function () {
  const obj = mongoose.Model.prototype.toJSON.apply(this, arguments);

  // Ensure arrays are properly initialized
  obj.expertise = Array.isArray(obj.expertise) ? obj.expertise : [];
  obj.languages = Array.isArray(obj.languages) ? obj.languages : [];
  obj.achievements = Array.isArray(obj.achievements) ? obj.achievements : [];

  return obj;
};

// Indexes for faster querying
mentorSchema.index({ user: 1 });
mentorSchema.index({ expertise: 1 });
mentorSchema.index({ rating: -1 });
mentorSchema.index({ isActive: 1, availability: 1 });

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;

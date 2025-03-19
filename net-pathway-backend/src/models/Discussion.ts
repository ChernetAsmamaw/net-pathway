import mongoose from "mongoose";

// Message Schema as a sub-document
const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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

// Discussion Schema
const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  messages: [messageSchema],
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
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

// Update lastActivity and updatedAt when a new message is added
discussionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  if (this.isModified('messages')) {
    this.lastActivity = new Date();
  }
  next();
});

// Create indexes for better performance
discussionSchema.index({ title: 'text', description: 'text' });
discussionSchema.index({ tags: 1 });
discussionSchema.index({ creator: 1 });
discussionSchema.index({ lastActivity: -1 });
discussionSchema.index({ participants: 1 });

const Discussion = mongoose.model("Discussion", discussionSchema);

export default Discussion;
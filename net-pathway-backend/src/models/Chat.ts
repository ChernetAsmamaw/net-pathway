// net-pathway-backend/src/models/Chat.ts
import mongoose from "mongoose";

// Message schema as a sub-document
const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Chat schema
const chatSchema = new mongoose.Schema({
  // The user who initiated the chat (non-mentor)
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // The mentor user
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Reference to the mentor profile
  mentorProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
    required: true,
  },
  messages: [messageSchema],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  // To check if the chat is active or archived
  isActive: {
    type: Boolean,
    default: true,
  },
  // Array for storing which users have unread messages
  unreadBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
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
chatSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // If messages are modified, update lastMessage timestamp
  if (this.isModified("messages")) {
    this.lastMessage = new Date();

    // If a new message is added and it's not empty
    if (this.messages && this.messages.length > 0) {
      const lastMsg = this.messages[this.messages.length - 1];

      // Set unreadBy to the user who didn't send the message
      if (lastMsg && lastMsg.sender) {
        // Convert to string for comparison
        const senderId = lastMsg.sender.toString();
        const initiatorId = this.initiator.toString();
        const mentorId = this.mentor.toString();

        // Clear the unreadBy array first
        this.unreadBy = [];

        // Add the recipient to unreadBy (the one who didn't send the message)
        if (senderId === initiatorId) {
          // Initiator sent the message, mentor should be marked as having unread messages
          this.unreadBy.push(this.mentor);
        } else if (senderId === mentorId) {
          // Mentor sent the message, initiator should be marked as having unread messages
          this.unreadBy.push(this.initiator);
        }
      }
    }
  }

  next();
});

// Create indexes for better query performance
chatSchema.index({ initiator: 1, mentor: 1 }, { unique: true });
chatSchema.index({ initiator: 1 });
chatSchema.index({ mentor: 1 });
chatSchema.index({ lastMessage: -1 });
chatSchema.index({ unreadBy: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;

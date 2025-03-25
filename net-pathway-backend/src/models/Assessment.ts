import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["behavioral", "aptitude", "transcript"],
  },
  responses: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  results: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  completedAt: {
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

// Update timestamp on save
assessmentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;

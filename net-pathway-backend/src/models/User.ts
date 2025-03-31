// net-pathway-backend/src/models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: function (this: any): any {
      return !this.googleId;
    },
    minlength: 6,
  },
  role: {
    type: String,
    enum: ["user", "admin", "mentor"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    trim: true,
    default: "",
  },
  highSchool: {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    graduationYear: {
      type: Number,
      min: 1900,
      max: 2100,
      default: null,
    },
  },
  educationYear: {
    type: String,
    enum: [
      "Freshman Year",
      "Sophomore Year",
      "Junior Year",
      "Senior Year",
      "Gap Year",
      "Other",
    ],
    default: "Other",
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 1000,
    default: "",
  },
  interests: {
    type: [String],
    default: [],
  },
  skills: {
    type: [String],
    default: [],
  },

  // track assessment completion status
  assessmentStatus: {
    transcript: {
      type: Boolean,
      default: false,
    },
    extracurricular: {
      type: Boolean,
      default: false,
    },
    behavioral: {
      type: Boolean,
      default: false,
    },
  },

  dateOfBirth: {
    type: Date,
    default: null,
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
userSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Create compound index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ googleId: 1 }, { sparse: true });
userSchema.index({ isEmailVerified: 1 }); // Add index for verification status

// Method to safely return user data without sensitive information
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.googleId;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;

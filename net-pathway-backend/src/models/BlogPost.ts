import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  views: {
    type: Number,
    default: 0,
  },
  publishedAt: {
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

// Update timestamps
blogPostSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // Set publishedAt if publishing for the first time
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Indexes for faster querying
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1 });
blogPostSchema.index({ author: 1 });

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;

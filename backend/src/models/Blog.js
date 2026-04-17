const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    image: {
      url: { type: String, default: '' },
      alt: { type: String, default: '' },
      credit: { type: String, default: '' },
    },
    tags: {
      type: [String],
      default: [],
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    topic: {
      type: String,
      default: '',
    },
    readingTime: {
      type: Number,
      default: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Index for status and date for fast list fetching
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ tags: 1 });

module.exports = mongoose.model('Blog', BlogSchema);

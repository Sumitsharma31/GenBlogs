const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', SubscriberSchema);


const mongoose = require('mongoose');

const bidSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
});

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    index: true,
  },
  biddingCloseAt: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  biddings: {
    type: [bidSchema],
    default: [],
  },
});

itemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);

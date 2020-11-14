const mongoose = require('mongoose');

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
    type: [
      {
        email: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        createdAt: {
          type: Date,
          required: true,
        },
      },
    ],
    default: [],
  },
});

itemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);

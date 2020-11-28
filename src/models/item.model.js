const mongoose = require('mongoose');

const bidSchema = mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        if (!mongoose.Types.ObjectId.isValid(ret.userId)) {
          ret.user = ret.userId;
          delete ret.userId;
        }
      },
    },
  }
);

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
  autoBidders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

// Select latest bidding because incoming biddings are
// pushed into array (latest = highest)
// Already checked to accept only higher bidding on frontend
itemSchema.statics.getHighestBidding = async function (itemId) {
  const finalItem = await this.findById(itemId).populate({
    path: 'biddings.userId',
    select: '-biddings',
  });
  return finalItem.biddings[finalItem.biddings.length - 1];
};

// Item Detail page need to get Item populated with username and email
// So, bidding interactions require populated query for return purpose
itemSchema.statics.findByIdAndPopulateBiddings = async function (itemId) {
  const item = await this.findById(itemId).populate({
    path: 'biddings.userId',
    select: 'username email',
  });
  return item;
};

itemSchema.statics.findByIdAndPopulateBiddingsAutoBidders = async function (
  itemId
) {
  const item = await this.findById(itemId)
    .populate({
      path: 'biddings.userId',
      select: 'username email',
    })
    .populate({ path: 'autoBidders', select: 'username email' });
  return item;
};

itemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Item', itemSchema);

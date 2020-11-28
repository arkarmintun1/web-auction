const mongoose = require('mongoose');
const mailSender = require('../utils/mail-sender');

const bidSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      requied: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: 'String',
      enum: ['Won', 'In Progress', 'Lost'],
      default: 'In Progress',
    },
    amount: {
      type: Number,
      required: true,
    },
    invoice: {
      type: String,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        if (!mongoose.Types.ObjectId.isValid(ret.itemId)) {
          ret.item = ret.itemId;
          delete ret.itemId;
        }
      },
    },
  }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      required: 'Username is required',
    },
    email: {
      type: String,
      trim: true,
      required: 'Email is required',
      unique: 'Email already exists',
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    biddings: {
      type: [bidSchema],
      default: [],
    },
    autoBidMax: {
      type: Number,
      default: 500,
    },
    autoBidAmount: {
      type: Number,
      default: 500,
    },
    autoBidAlert: {
      type: Number,
      default: 90,
    },
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.getAutoBidAmountByUserId = async function (userId) {
  const user = await this.findById(userId);
  return user.autoBidAmount;
};

userSchema.statics.reduceAutoBidAmountByUserId = async function (userId) {
  const user = await this.findById(userId);
  user.autoBidAmount = user.autoBidAmount - 1;

  // if user reamaining bid amount is at alert level send notification
  if (
    user.autoBidAmount ===
    Math.floor((user.autoBidMax * (100 - user.autoBidAlert)) / 100)
  ) {
    await mailSender.sendBidAlertEmail(
      user.username,
      user.email,
      user.autoBidAlert
    );
  }

  await user.save();
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    requied: true,
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
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
  },
});

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

module.exports = mongoose.model('User', userSchema);

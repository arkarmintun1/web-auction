const mongoose = require('mongoose');

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
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');
const config = require('../config');
const httpStatus = require('../utils/http-status');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(httpStatus.ClientError.Conflict)
        .json({ error: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, config.jwtSecret);

    // Remove some fields
    user.biddings = undefined;

    return res.json({ token, user });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while creating new user.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User does not exist.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res
        .status(httpStatus.ClientError.Unauthorized)
        .json({ error: 'Wrong password' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret);

    // Remove some fields
    user.biddings = undefined;

    return res.json({ token, user });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while logging in.' });
  }
};

const me = async (req, res) => {
  console.log(req.protocol + '://' + req.get('host'));
  const user = req.user;
  if (!user) {
    return res
      .status(httpStatus.ClientError.NotFound)
      .json({ error: 'User does not exist' });
  }

  // remove biddings since its not related
  user.biddings = undefined;

  return res.json({ user });
};

module.exports = { register, login, me };

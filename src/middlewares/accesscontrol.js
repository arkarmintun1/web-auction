const jwt = require('jsonwebtoken');

const config = require('../config');
const httpStatus = require('../utils/http-status');
const User = require('../models/user.model');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Access-Token');
    if (!token) {
      return res
        .status(httpStatus.ClientError.Forbidded)
        .json({ error: 'Access token is required' });
    }

    const validToken = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(validToken.id);

    if (!user) {
      return res
        .status(httpStatus.ClientError.NotFound)
        .json({ error: 'Provided user does not exist' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while authenticating user' });
  }
};

module.exports = { isAuthenticated };

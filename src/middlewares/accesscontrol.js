const jwt = require('jsonwebtoken');

const config = require('../config');
const httpStatus = require('../utils/http-status');
const User = require('../models/user.model');

/**
 * Request middleware that chceck whether
 * Access Token is included and is valid
 */
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

/**
 * Request middleware that check whether
 * current user is admin
 * (chain after isAuthorized to access req.user)
 */
const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role === 'admin') {
      next();
    } else {
      return res
        .status(httpStatus.ClientError.Forbidded)
        .json({ error: 'You are not authorized to access this route' });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while authenticating user' });
  }
};

module.exports = { isAuthenticated, isAdmin };

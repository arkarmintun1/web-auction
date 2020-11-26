const { body, header } = require('express-validator');

const getUserBiddings = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
];

module.exports = { getUserBiddings };

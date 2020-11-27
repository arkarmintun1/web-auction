const { body, header } = require('express-validator');

const toggleAutoBidder = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
];

module.exports = { toggleAutoBidder };

const { body, header } = require('express-validator');

const getUserBiddings = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
];

const updateAutoBidSettings = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
  body('autoBidAmount')
    .notEmpty()
    .withMessage('Auto Bid Amount cannot be empty')
    .isNumeric()
    .withMessage('Auto Bid Amount need to be a number'),
  body('autoBidAlert')
    .notEmpty()
    .withMessage('Auto Bid Alert cannot be empty')
    .isNumeric()
    .withMessage('Auto Bid Alert need to be a number')
    .isFloat({ min: 1, max: 100 })
    .withMessage('Auto Bid Alert should be between 1 and 100.'),
];

module.exports = { getUserBiddings, updateAutoBidSettings };

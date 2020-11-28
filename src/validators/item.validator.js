const { body, query, param, header } = require('express-validator');

const index = [
  query('query').optional().trim().escape(),
  query('sort').optional().trim().escape(),
  query('page').optional().isNumeric().withMessage('Page need to be a number'),
  query('limit')
    .optional()
    .isNumeric()
    .withMessage('Limit need to be a number'),
];

const create = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
  body('name').notEmpty().withMessage('Item name cannot be empty'),
  body('description')
    .notEmpty()
    .withMessage('Item description cannot be empty'),
  body('biddingCloseAt')
    .notEmpty()
    .withMessage('Item bidding close date cannot be empty')
    .isDate()
    .withMessage('Date format need to be provided'),
];

const read = [
  param('itemId')
    .notEmpty()
    .withMessage('Item Id is required')
    .isMongoId()
    .withMessage('Invalid item id'),
];

const update = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
  body('name').optional(),
  body('description').optional(),
  body('biddingCloseAt')
    .optional()
    .isDate()
    .withMessage('Date format need to be provided'),
  param('itemId')
    .notEmpty()
    .withMessage('Item Id is required')
    .isMongoId()
    .withMessage('Invalid item id'),
];

const remove = [
  param('itemId')
    .notEmpty()
    .withMessage('Item Id is required')
    .isMongoId()
    .withMessage('Invalid item id'),
];

const toggleAutoBidder = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
];

const bid = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
  body('amount')
    .notEmpty()
    .withMessage('Bidding amount cannot be empty')
    .isNumeric()
    .withMessage('Bidding amount needs to be a number'),
  param('itemId')
    .notEmpty()
    .withMessage('Item Id is required')
    .isMongoId()
    .withMessage('Invalid item id'),
];

module.exports = { index, create, read, update, remove, bid, toggleAutoBidder };

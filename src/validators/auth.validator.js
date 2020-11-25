const { body, header } = require('express-validator');

const register = [
  body('username')
    .notEmpty()
    .withMessage('Username cannot be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Username too short')
    .isLength({ max: 255 })
    .withMessage('Username too long'),
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .trim()
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail()
    .isLength({ min: 3 })
    .withMessage('Email too short')
    .isLength({ max: 255 })
    .withMessage('Email too long'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Password too short')
    .isLength({ max: 255 })
    .withMessage('Password too long'),
];

const login = [
  body('email')
    .notEmpty()
    .withMessage('Email cannot be empty')
    .trim()
    .isEmail()
    .withMessage('Email address is not valid')
    .normalizeEmail()
    .isLength({ min: 3 })
    .withMessage('Email too short')
    .isLength({ max: 255 })
    .withMessage('Email too long'),
  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Password too short')
    .isLength({ max: 255 })
    .withMessage('Password too long'),
];

const me = [
  header('Access-Token')
    .notEmpty()
    .withMessage('Access Token is required')
    .trim(),
];

module.exports = { register, login, me };

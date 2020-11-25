const express = require('express');

const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');
const validatorHandler = require('../middlewares/express-validator-handler');
const { isAuthenticated } = require('../middlewares/accesscontrol');

const router = express.Router();

router.post(
  '/register',
  authValidator.register,
  validatorHandler,
  authController.register
);

router.post(
  '/login',
  authValidator.login,
  validatorHandler,
  authController.login
);

router.get(
  '/me',
  authValidator.me,
  validatorHandler,
  isAuthenticated,
  authController.me
);

module.exports = router;

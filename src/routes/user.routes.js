const express = require('express');

const userValidator = require('../validators/user.validator');
const userController = require('../controllers/user.controller');
const validatorHandler = require('../middlewares/express-validator-handler');
const { isAuthenticated } = require('../middlewares/accesscontrol');

const router = express.Router();

router.get(
  '/biddings',
  userValidator.getUserBiddings,
  validatorHandler,
  isAuthenticated,
  userController.getUserBiddings
);

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');

const itemValidator = require('../validators/item.validator');
const itemController = require('../controllers/item.controller');
const validatorHandler = require('../middlewares/express-validator-handler');
const { isAuthenticated, isAdmin } = require('../middlewares/accesscontrol');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/uploads');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${path.parse(file.originalname).name}-${Date.now()}${
        path.parse(file.originalname).ext
      }`
    );
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Get All
router.get(
  '/',
  itemValidator.index,
  validatorHandler,
  isAuthenticated,
  itemController.index
);

// Create
router.post(
  '/',
  upload.single('image'),
  itemValidator.create,
  validatorHandler,
  isAuthenticated,
  isAdmin,
  itemController.create
);

// Read
router.get(
  '/:itemId',
  itemValidator.read,
  validatorHandler,
  isAuthenticated,
  itemController.read
);

// Update
router.put(
  '/:itemId',
  upload.single('image'),
  itemValidator.update,
  validatorHandler,
  isAuthenticated,
  isAdmin,
  itemController.update
);

// Delete
router.delete(
  '/:itemId',
  itemValidator.remove,
  validatorHandler,
  isAuthenticated,
  isAdmin,
  itemController.remove
);

// add bidding
router.post(
  '/:itemId/biddings',
  itemValidator.bid,
  validatorHandler,
  isAuthenticated,
  itemController.bid
);

// auto bidding setting on/off
router.get(
  '/:itemId/toggleAutoBidder',
  itemValidator.toggleAutoBidder,
  validatorHandler,
  isAuthenticated,
  itemController.toggleAutoBidder
);

module.exports = router;

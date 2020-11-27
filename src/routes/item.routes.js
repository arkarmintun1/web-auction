const express = require('express');
const multer = require('multer');
const path = require('path');

const Item = require('../models/item.model');
const itemValidator = require('../validators/item.validator');
const itemController = require('../controllers/item.controller');
const validatorHandler = require('../middlewares/express-validator-handler');
const { isAuthenticated } = require('../middlewares/accesscontrol');

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
router.get('/', itemController.index);

// Create
router.post('/', upload.single('image'), itemController.create);

// Read
router.get('/:itemId', itemController.read);

// Update
router.put('/:itemId', upload.single('image'), itemController.update);

// Delete
router.delete('/:itemId', itemController.remove);

router.post('/:itemId/biddings', itemController.bid);

router.get(
  '/:itemId/toggleAutoBidder',
  itemValidator.toggleAutoBidder,
  validatorHandler,
  isAuthenticated,
  itemController.toggleAutoBidder
);

router.get('/test', itemController.test);

module.exports = router;

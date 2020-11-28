const User = require('../models/user.model');
const httpStatus = require('../utils/http-status');

const getUserBiddings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(httpStatus.ClientError.NotFound)
        .json({ error: 'User does not exist' });
    }

    const userWithBiddings = await User.findById(user._id).populate({
      path: 'biddings.itemId',
      select: '-biddings',
    });

    if (!userWithBiddings.biddings) {
      return res
        .status(httpStatus.ClientError.NotFound)
        .json({ error: 'Biddings does not exists' });
    }

    return res.json({ biddings: userWithBiddings.biddings });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while creating new user.' });
  }
};

const updateAutoBidSettings = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(httpStatus.ClientError.NotFound)
        .json({ error: 'User does not exist' });
    }

    const { autoBidAmount, autoBidAlert } = req.body;
    user.autoBidMax = autoBidAmount;
    user.autoBidAmount = autoBidAmount;
    user.autoBidAlert = autoBidAlert;
    await user.save();

    // Since biddings list should not be returned
    user.biddings = undefined;

    return res.json({ user });
  } catch (error) {
    console.log(error);
    return res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred while creating new user.' });
  }
};

module.exports = { getUserBiddings, updateAutoBidSettings };

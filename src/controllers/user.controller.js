const User = require('../models/user.model');
const httpStatus = require('../utils/http-status');

const getUserBiddings = async (req, res) => {
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
};

module.exports = { getUserBiddings };

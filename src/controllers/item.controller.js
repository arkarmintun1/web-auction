const schedule = require('node-schedule');

const Item = require('../models/item.model');
const User = require('../models/user.model');
const socket = require('../server');
const mailSender = require('../utils/mail-sender');
const { generateInvoice } = require('../utils/invoice');
const httpStatus = require('../utils/http-status');

/**
 * route - /api/items
 * method - GET
 * description - response with a list of items that
 * can be paginated, sorted by price and searchable
 */
const index = async (req, res) => {
  try {
    const { query, sort, page = 1, limit = 10 } = req.query;
    const searchQuery = query ? { $text: { $search: query } } : {};
    const sortQuery = sort ? { [sort]: -1 } : {};
    const items = await Item.find(searchQuery)
      .sort(sortQuery)
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .select('-autoBidders -biddings')
      .exec();

    // count is related to search query for pagination
    const count = await Item.countDocuments(searchQuery);

    res.json({
      items,
      totalItems: parseInt(count),
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items
 * method - POST
 * description - create new item with provided values
 * also schedule a job to send email notification to
 * bid winner if present
 */
const create = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'Image is not included' });
    }

    const { name, description, biddingCloseAt } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const item = await Item.create({
      name,
      description,
      imageUrl,
      biddingCloseAt,
    });
    const notifyOn = new Date(biddingCloseAt);

    // Send winning message to the highest bidder when bidding close
    schedule.scheduleJob(item._id.toString(), notifyOn, async () => {
      console.log(`Bidding has been closed for item with id: ${item._id}`);
      try {
        const highestBidding = await Item.getHighestBidding(item._id);
        if (highestBidding) {
          const toEmail = highestBidding.userId.email;

          // Generate Invoice
          const invoicePath = await generateInvoice({
            username: highestBidding.userId.username,
            email: highestBidding.userId.email,
            item: { _id: item._id, name: name, price: highestBidding.amount },
          });

          // Status update for users (Won or Lost)
          const biddingItem = await Item.findById(item._id);
          biddingItem.biddings.forEach(async (bidding) => {
            const user = await User.findById(bidding.userId);
            if (user._id.toString() === highestBidding.userId._id.toString()) {
              user.biddings.forEach((userBidding) => {
                if (userBidding.itemId.toString() === item._id.toString()) {
                  userBidding.invoice = invoicePath;
                  userBidding.status = 'Won';
                }
              });
              await user.save();
            } else {
              user.biddings.forEach((userBidding) => {
                if (userBidding.itemId.toString() === item._id.toString()) {
                  userBidding.status = 'Lost';
                }
              });
              await user.save();
            }
          });

          // Send email to the winner
          await mailSender.sendAwardedEmail(
            highestBidding.userId.username,
            toEmail,
            name,
            highestBidding.amount,
            invoicePath
          );
        } else {
          console.log('No highest bidding exists, no email will be sent.');
        }
      } catch (error) {
        console.log(error);
      }
    });

    res.json(item);
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items/:itemId
 * method - GET
 * description - get the item details that are
 * pre-populated with biddings
 */
const read = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Find by Id and populate because the return item
    // will need biddings info (username, email)
    const item = await Item.findByIdAndPopulateBiddings(itemId);

    if (!item) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'Item does not exists' });
    }
    return res.json(item);
  } catch (eror) {
    console.log(error);
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items/:itemId
 * method - PUT
 * description - update item with provided values
 * if not provided, leave as it is. Also, adjust
 * email sending job accordingly
 */
const update = async (req, res) => {
  try {
    const { name, description, biddingCloseAt } = req.body;
    const itemId = req.params.itemId;

    // Find by Id and populate because the return item
    // will need biddings info (username, email)
    const item = await Item.findByIdAndPopulateBiddings(itemId);

    if (!item) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'Item not found' });
    }

    // Update and save new data
    if (name) item.name = name;
    if (description) item.description = description;
    if (biddingCloseAt) item.biddingCloseAt = biddingCloseAt;
    if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;
    await item.save();

    // If bidding close date changed, reschedule bid close job
    const scheduledJob = schedule.scheduledJobs[itemId];
    if (scheduledJob) {
      scheduledJob.reschedule(new Date(biddingCloseAt));
    }

    res.json(item);
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items/:itemId
 * method - DELETE
 * description - delete item from the list
 */
const remove = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    // Find and let the user know if the item doesn't exist ALREADY
    const item = await Item.findById(itemId);

    if (!item) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'Item does not exists' });
    }

    // Find and delete existing item
    await Item.findByIdAndDelete(itemId);

    return res.json({ msg: 'Successfully deleted' });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items/:itemId/biddings
 * method - POST
 * description - place a bit as a logged in user
 * bid will be added in both items and user document.
 * Trigger an event to refresh updated item with
 * new biddin information
 */
const bid = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { amount } = req.body;
    const userId = loggedInUser.id;
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);

    if (!item) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'Item does not exists' });
    }

    if (amount <= item.price) {
      return res
        .status(httpStatus.ClientError.BadRequest)
        .json({ error: 'You bidding amount need to be higher.' });
    }

    item.price = amount;
    item.biddings.push({ userId, amount, created: Date.now() });
    await item.save();

    // Add bidding to the user account
    const user = await User.findById(userId);
    const biddingExists = user.biddings.some(
      (bidding) => bidding.itemId.toString() === itemId
    );
    if (biddingExists) {
      user.biddings.forEach((bidding) => {
        if (bidding.itemId.toString() === itemId) {
          bidding.amount = amount;
          bidding.updated = Date.now();
        }
      });
    } else {
      user.biddings.push({
        itemId: itemId,
        name: item.name,
        amount: amount,
        updated: Date.now(),
      });
    }
    await user.save();

    // Find by Id and populate because the return item
    // will need biddings info (username, email)
    const updatedItem = await Item.findByIdAndPopulateBiddingsAutoBidders(
      itemId
    );

    // Trigger an event that there's a new bidding
    socket.ioObject.sockets.emit('bid_placed', updatedItem);

    // Send email

    // Get emails of bidders
    const bidders = updatedItem.biddings.map((bidding) => {
      return { email: bidding.userId.email, username: bidding.userId.username };
    });

    // Remove duplicates, autobidders and current user
    const uniqueBidders = bidders
      .filter(
        ({ email }, index) =>
          bidders.findIndex((uniqueBidder) => uniqueBidder.email === email) ===
          index
      )
      .filter(
        ({ email }) =>
          !updatedItem.autoBidders.some(
            (autoBidder) => autoBidder.email === email
          )
      )
      .filter(({ email }) => email != user.email);

    // send email to users
    uniqueBidders.forEach(async ({ email, username }) => {
      await mailSender.sendNewBidPresentEmail(
        username,
        email,
        updatedItem.name
      );
    });

    // Check if there is any autobidder and act accordingly
    await checkAutoBidder(itemId);

    // Return updated item
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

/**
 * route - /api/items/:itemId/toggleAutoBidder
 * method - GET
 * description - Turn on/off auto-bidding feature
 * It has chain effects on checking and updating if
 * there are multiple users that turned on auto-bidding.
 */
const toggleAutoBidder = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(httpStatus.ClientError.NotFound)
        .json({ error: 'User does not exist' });
    }
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId).populate({
      path: 'biddings.userId',
      select: 'username email',
    });

    const existingAutoBidderIndex = item.autoBidders.findIndex(
      (autoBidderId) => {
        return autoBidderId.toString() === user._id.toString();
      }
    );

    if (existingAutoBidderIndex < 0) {
      item.autoBidders.push(user._id);
    } else {
      item.autoBidders.splice(existingAutoBidderIndex, 1);
    }
    await item.save();

    await checkAutoBidder(itemId);

    // Trigger an event that there's a new bidding
    socket.ioObject.sockets.emit('bid_placed', item);

    res.json({ success: 'successfully updated' });
  } catch (error) {
    res
      .status(httpStatus.ClientError.BadRequest)
      .json({ error: 'Error occurred' });
  }
};

/**
 * Check whether auto bidder exists
 * Loop through auto bidders and out bid
 * until the user has stopped auto bidding or
 * auto bidding amount exceeded
 */
const checkAutoBidder = async (itemId) => {
  try {
    const originalItem = await Item.findById(itemId);
    const autoBidders = originalItem.autoBidders;
    const biddingOpen = new Date(originalItem.biddingCloseAt) - Date.now() > 0;

    // If autobidders exists
    if (biddingOpen && autoBidders.length) {
      originalItem.autoBidders.forEach(async (autoBidderId) => {
        const item = await Item.findById(itemId);
        const highestBidding = await Item.getHighestBidding(itemId);

        if (
          !highestBidding ||
          highestBidding.userId._id.toString() != autoBidderId.toString()
        ) {
          const availableBiddingAmount = await User.getAutoBidAmountByUserId(
            autoBidderId
          );

          if (availableBiddingAmount > 0) {
            await placeBidding(autoBidderId, itemId, item.price + 1);
            await User.reduceAutoBidAmountByUserId(autoBidderId);
            setTimeout(() => {
              console.log('Wait before placing new Bid!');
              checkAutoBidder(itemId);
            }, 1000);
          } else {
            const user = await User.findById(autoBidderId);
            await mailSender.sendBidAmountExceededEmail(
              user.username,
              user.email
            );
          }
        }
      });
    } else {
      console.log('auto bidders do not exist.');
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Place bid in the item
 * Update for the user
 * Emit event that there is a change
 */
const placeBidding = async (userId, itemId, amount) => {
  const item = await Item.findById(itemId);
  item.price = amount;
  item.biddings.push({ userId, amount, created: Date.now() });
  await item.save();

  // Add bidding to the user account
  const user = await User.findById(userId);
  const biddingExists = user.biddings.some(
    (bidding) => bidding.itemId.toString() === itemId
  );
  if (biddingExists) {
    user.biddings.forEach((bidding) => {
      if (bidding.itemId.toString() === itemId) {
        bidding.amount = amount;
        bidding.updated = Date.now();
      }
    });
  } else {
    user.biddings.push({
      itemId: itemId,
      name: item.name,
      amount: amount,
      updated: Date.now(),
    });
  }
  await user.save();

  // Get updated item with biddings to return
  const updatedItem = await Item.findByIdAndPopulateBiddings(itemId);

  // Trigger an event that there's a new bidding
  socket.ioObject.sockets.emit('bid_placed', updatedItem);
};

module.exports = {
  index,
  create,
  read,
  update,
  remove,
  bid,
  toggleAutoBidder,
};

const schedule = require('node-schedule');

const Item = require('../models/item.model');
const User = require('../models/user.model');
const socket = require('../server');
const mailSender = require('../utils/mail-sender');

const index = async (req, res) => {
  try {
    const { query, sort, page = 1, limit = 10 } = req.query;
    const searchQuery = query ? { $text: { $search: query } } : {};
    const sortQuery = sort ? { [sort]: -1 } : {};
    const items = await Item.find(searchQuery)
      .sort(sortQuery)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    const count = await Item.countDocuments(searchQuery);
    // const count = items.length;
    res.send({
      items,
      totalItems: parseInt(count),
      totalPages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const create = async (req, res) => {
  try {
    const { name, description, biddingCloseAt } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const item = await Item.create({
      name,
      description,
      imageUrl,
      biddingCloseAt,
    });
    const notifyOn = new Date(biddingCloseAt);
    schedule.scheduleJob(item._id.toString(), notifyOn, async () => {
      const info = await mailSender.sendMail({
        from: 'arkarmintun1@gmail.com',
        to: '2b1a84444b-36156a@inbox.mailtrap.io, arkarmintun1@gmail.com',
        subject: 'Auction Result',
        text: 'You have won the auction',
      });

      console.log('Message sent: %s', info.messageId);
    });
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const read = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId).populate({
      path: 'biddings.userId',
      select: 'username',
    });
    if (!item) {
      return res.status(400).json({ error: 'Item does not exists' });
    }
    return res.status(200).json(item);
  } catch (eror) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const update = async (req, res) => {
  try {
    const { name, description, biddingCloseAt } = req.body;
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    if (name) item.name = name;
    if (description) item.description = description;
    if (biddingCloseAt) item.biddingCloseAt = biddingCloseAt;
    if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;
    await item.save();

    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const remove = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ error: 'Item does not exists' });
    }
    await Item.findByIdAndDelete(itemId);
    return res.status(200).json({ msg: 'Successfully deleted' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const bid = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    item.price = amount;
    item.biddings.push({ userId, amount, created: Date.now() });
    await item.save();

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
        amount: amount,
        updated: Date.now(),
      });
    }
    await user.save();

    const updatedItem = await Item.findById(itemId).populate({
      path: 'biddings.userId',
      select: 'username',
    });

    socket.ioObject.sockets.emit('bid_placed', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

module.exports = { index, create, read, update, remove, bid };

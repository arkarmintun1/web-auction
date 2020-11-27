const schedule = require('node-schedule');

const Item = require('../models/item.model');
const User = require('../models/user.model');
const socket = require('../server');
const mailSender = require('../utils/mail-sender');
const { generateInvoice } = require('../utils/invoice');

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

    // Send winning message to the highest bidder when bidding close
    schedule.scheduleJob(item._id.toString(), notifyOn, async () => {
      console.log('JOB STARTED RUNNING');
      const highestBidder = await Item.getHighestBidder(item._id);
      if (highestBidder) {
        const toEmail = highestBidder.userId.email;

        // Generate Invoice
        const invoicePath = await generateInvoice({
          username: highestBidder.userId.username,
          email: highestBidder.userId.email,
          item: { _id: item._id, name: name, price: highestBidder.amount },
        });

        const biddingItem = await Item.findById(item._id);
        biddingItem.biddings.forEach(async (bidding) => {
          const user = await User.findById(bidding.userId);
          if (user._id.toString() === highestBidder.userId._id.toString()) {
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

        const info = await mailSender.sendMail({
          from: 'arkarmintun1@gmail.com',
          to: [
            'arkarmintun1@gmail.com',
            toEmail,
            '2b1a84444b-7b295c@inbox.mailtrap.io',
          ],
          subject: 'Auction Result [Awarded]',
          html: `<h3>Dear ${highestBidder.userId.username},</h3><br/><p>Congratulations.</p><p>You have won the auction for the <strong>${name}</strong> with the price of <b>${highestBidder.amount} USD</b>. Tax may apply, please check your invoice. Please contact the web auction operation team for futher steps.</p>`,
          attachments: [
            {
              filename: 'invoice.pdf',
              path: `http://localhost:3002${invoicePath}`,
            },
          ],
        });

        console.log('Message sent: %s', info);
      }
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

    const item = await Item.findById(itemId).populate({
      path: 'biddings.userId',
      select: 'username email',
    });
    if (!item) {
      return res.status(400).json({ error: 'Item not found' });
    }

    if (name) item.name = name;
    if (description) item.description = description;
    if (biddingCloseAt) item.biddingCloseAt = biddingCloseAt;
    if (req.file) item.imageUrl = `/uploads/${req.file.filename}`;
    await item.save();

    // If bidding close date changed, reschedule
    const scheduledJob = schedule.scheduledJobs[itemId];
    if (scheduledJob) {
      scheduledJob.reschedule(new Date(biddingCloseAt));
    }

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
    // Add bidding to the item
    const { userId, amount } = req.body;
    const itemId = req.params.itemId;
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
    const updatedItem = await Item.findById(itemId).populate({
      path: 'biddings.userId',
      select: 'username email',
    });

    // Trigger an event that there's a new bidding
    socket.ioObject.sockets.emit('bid_placed', updatedItem);

    // Send email to all user that there's an updated bid
    const emails = updatedItem.biddings.map((bidding) => {
      return bidding.userId.email;
    });
    const uniqueEmails = emails.filter(
      (email, index) => emails.indexOf(email) === index
    );
    uniqueEmails.forEach(async (email) => {
      if (email != user.email) {
        const info = await mailSender.sendMail({
          from: 'arkarmintun1@gmail.com',
          to: [
            'arkarmintun1@gmail.com',
            email,
            '2b1a84444b-7b295c@inbox.mailtrap.io',
          ],
          subject: 'New Bidding on your Item',
          text:
            'Other users are also bidding the same item as you. Please hurry to out-bit them.',
        });

        console.log('Message sent: %s', info);
      }
    });

    // Return updated item
    res.json(updatedItem);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

module.exports = { index, create, read, update, remove, bid };

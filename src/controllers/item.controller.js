const multer = require('multer');
const { parse } = require('path');
const path = require('path');

const Item = require('../models/item.model');

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
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

const read = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
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
    const { email, amount } = req.body;
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    item.price = amount;
    item.biddings.push({ email, amount, createdAt: Date.now() });
    await item.save();
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error occurred' });
  }
};

module.exports = { index, create, read, update, remove, bid };

const nodemailer = require('nodemailer');

const config = require('../config');

const mailSender = nodemailer.createTransport({
  host: config.mailHost,
  port: config.mailPort,
  auth: {
    user: config.mailUser,
    pass: config.mailPass,
  },
});

module.exports = mailSender;

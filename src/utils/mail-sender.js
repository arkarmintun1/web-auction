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

const fromEmailAddress = 'arkarmintun1@gmail.com';

/**
 * There’s been a new bid on that item
 * More than one 'to' emails has been added for testing purpose
 */
const sendNewBidPresentEmail = async (username, email, itemname) => {
  const info = await mailSender.sendMail({
    from: fromEmailAddress,
    to: [
      'arkarmintun1@gmail.com',
      email,
      '2b1a84444b-7b295c@inbox.mailtrap.io',
    ],
    subject: 'New Biddings On Your Item',
    html: `
    <p>
      Dear ${username},
    </p>
    <br/>
    <p>Just a kind reminder.</p>
    <p>
      There has been new bids placed on the item <strong>${itemname}</strong>. Please by hurry to out bid.
    </p>`,
  });

  console.log('Message sent: %s', info);
};

/**
 * The bidding time has finished / the item was awarded
 * More than one 'to' emails has been added for testing purpose
 */
const sendAwardedEmail = async (
  username,
  email,
  itemname,
  amount,
  invoicePath
) => {
  const info = await mailSender.sendMail({
    from: fromEmailAddress,
    to: [
      'arkarmintun1@gmail.com',
      email,
      '2b1a84444b-7b295c@inbox.mailtrap.io',
    ],
    subject: 'Auction Result [Awarded]',
    html: `
    <p>
      Dear ${username},
    </p>
    <br/>
    <p>Congratulations.</p>
    <p>
      You have won the auction for the <strong>${itemname}</strong> with the price of <b>${amount} USD</b>. 
      Tax may apply, please check your invoice. Please contact the web auction operation team for futher steps.
    </p>`,
    attachments: [
      {
        filename: 'invoice.pdf',
        path: `http://localhost:3002${invoicePath}`,
      },
    ],
  });

  console.log('Message sent: %s', info);
};

/**
 * Notification for when the total amount was bid + state of the item
 * More than one 'to' emails has been added for testing purpose
 */
const sendBidAlertEmail = async (username, email, percentage) => {
  const info = await mailSender.sendMail({
    from: fromEmailAddress,
    to: [
      'arkarmintun1@gmail.com',
      email,
      '2b1a84444b-7b295c@inbox.mailtrap.io',
    ],
    subject: 'Auto Bid Alert',
    html: `
    <p>
      Dear ${username},
    </p>
    <br/>
    <p>Just a kind reminder.</p>
    <p>
      Your auto bid amount has reached ${percentage}%. Please add more auto bid amount by visiting to the site.
    </p>`,
  });

  console.log('Message sent: %s', info);
};

/**
 * Notification for when the current bid exceeds your maximum auto-bid amount
 * More than one 'to' emails has been added for testing purpose
 */
const sendBidAmountExceededEmail = async (username, email) => {
  const info = await mailSender.sendMail({
    from: fromEmailAddress,
    to: [
      'arkarmintun1@gmail.com',
      email,
      '2b1a84444b-7b295c@inbox.mailtrap.io',
    ],
    subject: 'Auto Bid Not Enough',
    html: `
    <p>
      Dear ${username},
    </p>
    <br/>
    <p>Just a kind reminder.</p>
    <p>
      All of your auto bid amount has been used and other users are out-bidding you. Please add more auto bid amount by visiting to the site or bid on your item.
    </p>`,
  });

  console.log('Message sent: %s', info);
};

module.exports = {
  sendNewBidPresentEmail,
  sendAwardedEmail,
  sendBidAlertEmail,
  sendBidAmountExceededEmail,
};

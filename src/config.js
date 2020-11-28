const dotenv = require('dotenv');

dotenv.config();

if (!process.env.MAIL_HOST) {
  console.log('MAIL_HOST value is not provided');
  process.exit(9);
}

if (!process.env.MAIL_PORT) {
  console.log('MAIL_PORT value is not provided');
  process.exit(9);
}

if (!process.env.MAIL_USER) {
  console.log('MAIL_USER value is not provided');
  process.exit(9);
}

if (!process.env.MAIL_PASS) {
  console.log('MAIL_PASS value is not provided');
  process.exit(9);
}

module.exports = {
  port: process.env.PORT || 3002,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/web_auction',
  jwtSecret: process.env.JWT_SECRET || '1234567890',
  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUser: process.env.MAIL_USER,
  mailPass: process.env.MAIL_PASS,
};

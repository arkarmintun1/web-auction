const easyinvoice = require('easyinvoice');
const path = require('path');
const fs = require('fs');

const generateInvoice = async ({ username, email, item }) => {
  let data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    currency: 'USD',
    taxNotation: 'vat', //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    // logo: 'https://www.easyinvoice.cloud/img/logo.png', //or base64
    // logoExtension: 'png', //only when logo is base64
    sender: {
      company: 'Web Auction Corp',
      address: '77/79, Upper Pazndaung',
      zip: '11221',
      city: 'Yangon',
      country: 'Myanmar',
      // "custom1": "custom value 1",
      // "custom2": "custom value 2",
      // "custom3": "custom value 3"
    },
    client: {
      company: '',
      address: '',
      zip: '',
      city: '',
      country: '',
      custom1: username,
      custom2: email,
      // "custom3": "custom value 3"
    },
    invoiceNumber: item._id,
    invoiceDate: Date.now().toString(),
    products: [
      {
        quantity: '1',
        description: item.name,
        tax: 5,
        price: item.price,
      },
    ],
    bottomNotice: 'Kindly pay your invoice within 15 days.',
  };

  const result = await easyinvoice.createInvoice(data);
  const filePath = `../public/invoices/${item._id}_${Date.now()}.pdf`;
  await fs.writeFileSync(path.join(__dirname, filePath), result.pdf, 'base64');
  return filePath.replace('../public', '');
};

module.exports = { generateInvoice };

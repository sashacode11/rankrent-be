const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nodemailer = require('nodemailer');
const connectDB = require('../config/db');

function loadNiches(directory) {
  let niches = {};
  fs.readdirSync(directory).forEach(file => {
    if (path.extname(file) === '.yaml') {
      const data = yaml.load(
        fs.readFileSync(path.join(directory, file), 'utf8')
      );
      const nicheName = path.basename(file, '.yaml');
      niches[nicheName] = data;
    }
  });
  return niches;
}

// Connect DB
let data = {};
router.get('/', (req, res) => {
  fs.createReadStream('locality.csv')
    .pipe(csv())
    .on('data', row => {
      if (!data[row.region]) {
        data[row.region] = [];
      }
      data[row.region].push({ locality: row.locality });
    })
    .on('end', () => {
      const niches = loadNiches('./niches');
      connectDB.query(
        'SELECT CustomerName, EmailAddress FROM Customers',
        (err, customers) => {
          if (err) {
            console.error('Database query failed', err);
          }
          res.render('index', {
            data: data,
            niches: niches,
            customers: customers,
          });
        }
      );
    });
});

// Email sending route
router.post('/send-email', async (req, res) => {
  const recipientEmail = req.body.customerEmail;

  const trannsporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: recipientEmail,
    subject: 'Your Invoice Link from Inquirita',
    text: 'Here is your invoice and link to pay: [Link Here]',
  };

  // Send the email
  try {
    const info = await trannsporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    // res.send('Email sent successfully to ' + recipientEmail);
    res.redirect(
      '/send-email-status?email=' + encodeURIComponent(recipientEmail)
    );
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).send('Failed to send email');
  }
});

router.get('/send-email-status', (req, res) => {
  const recipientEmail = req.query.email;
  res.render('send-email-status', { recipientEmail });
});

module.exports = router;

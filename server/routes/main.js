const express = require('express');
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const nodemailer = require('nodemailer');
const connectDB = require('../config/db');
const ejs = require('ejs');

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

      // First query
      connectDB.query(
        'SELECT termId, term, multiplier  amount FROM TermAmounts',
        (err, terms) => {
          if (err) {
            console.error('Database query for terms failed:', err);
            return;
          }
          //   console.log('Fetched terms and amounts data:', terms);

          // Second query inside the callback of the first
          connectDB.query(
            'SELECT CustomerName, EmailAddress FROM Customers',
            (err, customers) => {
              if (err) {
                console.error('Database query for customers failed:', err);
                return;
              }
              // console.log('Terms and amounts data:', terms);

              // Third query
              connectDB.query(
                `
                SELECT l.locniType, l.locniId, p.termId, p.amount 
                FROM LocniPricing p 
                JOIN LocniTypes l ON p.locniId = l.locniId
                WHERE p.termId = 1
              `,
                (err, locniPricing) => {
                  if (err) {
                    console.error(
                      'Database query for locni types and pricing failed:',
                      err
                    );
                    return;
                  }

                  res.render('index', {
                    data: data,
                    niches: niches,
                    customers: customers,
                    terms: terms,
                    locniPricing: locniPricing,
                  });
                }
              );
            }
          );
        }
      );
    });
});

const ejsFilePath = path.join(
  __dirname,
  '..',
  '..',
  'views',
  'invoice-email.ejs'
);

// Email sending route
router.post('/send-email', async (req, res) => {
  const recipientEmail = req.body.customerEmail;
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  try {
    // Render the EJS file to HTML
    const html = await ejs.renderFile(ejsFilePath, {
      term: req.body.term,
      region: req.body.region,
      niche: req.body.niche,
      locality: req.body.locality,
      subtotal: req.body.subtotal,
      paymentLink: `http://localhost:3001/pay-invoice?term=${encodeURIComponent(
        req.body.term
      )}&region=${encodeURIComponent(
        req.body.region
      )}&niche=${encodeURIComponent(
        req.body.niche
      )}&locality=${encodeURIComponent(req.body.locality)}`,
    });

    // Prepare the email options
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: recipientEmail,
      subject: 'Your Invoice Link from Inquirita',
      html: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
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

router.get('/pay-invoice', (req, res) => {
  // Render the payment page with details passed via query parameters
  res.render('pay-invoice', {
    term: req.query.term,
    region: req.query.region,
    niche: req.query.niche,
    locality: req.query.locality,
  });
});

module.exports = router;

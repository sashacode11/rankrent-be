const expressLayout = require('express-ejs-layouts');
const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const mysql = require('mysql');
require('dotenv').config();
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Templating engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'InquiritaBilling',
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database successfully');
});

let data = {};
app.get('/', (req, res) => {
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
      db.query(
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
app.post('/send-email', async (req, res) => {
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

app.get('/send-email-status', (req, res) => {
  const recipientEmail = req.query.email;
  res.render('send-email-status', { recipientEmail });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

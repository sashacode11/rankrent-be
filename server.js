require('dotenv').config();

const expressLayout = require('express-ejs-layouts');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const https = require('https');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Define the path to your SSL files
const privateKeyPath = path.join(__dirname, 'localhost.key');
const certificatePath = path.join(__dirname, 'localhost.crt');

// // Read the private key and certificate file
// const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
// const certificate = fs.readFileSync(certificatePath, 'utf8');

// // Create credentials object
// const credentials = { key: privateKey, cert: certificate };

// // Create HTTPS server with credentials
// const httpsServer = https.createServer(credentials, app);

// Read the private key and certificate file
let server;
if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  const certificate = fs.readFileSync(certificatePath, 'utf8');
  const credentials = { key: privateKey, cert: certificate };

  // Create HTTPS server with credentials
  const httpsServer = https.createServer(credentials, app);
  server = httpsServer;
  console.log('Using HTTPS server');
} else {
  // Fall back to HTTP if SSL certificates are not available
  console.log('SSL certificate not found, using HTTP.');
  server = app;
}

// Templating engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./server/routes/main'));

server.listen(PORT, () => {
  console.log(`HTTPS Server is running on port ${PORT}`);
});

require('dotenv').config();

const expressLayout = require('express-ejs-layouts');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Templating engine
app.use(expressLayout);
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

app.use(express.static('public'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./server/routes/main'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

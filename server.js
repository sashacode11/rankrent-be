const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  let data = {};

  fs.createReadStream('locality.csv')
    .pipe(csv())
    .on('data', row => {
      if (!data[row.region]) {
        data[row.region] = [];
      }
      if (!data[row.locality]) {
        data[row.locality] = [];
      }
    })
    .on('end', () => {
      res.render('index', { data: data });
    });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

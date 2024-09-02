const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

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
      res.render('index', { data: data, niches: niches });
    });
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

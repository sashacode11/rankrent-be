const mysql = require('mysql');

function connectDB() {
  const connectDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'InquiritaBilling',
  });

  // Connect to the database
  connectDB.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database successfully');
  });
}

module.exports = connectDB;

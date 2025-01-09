// poolfile.js
const mysql = require("mysql2/promise"); // Use mysql2 for promise support
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST, // Database host, e.g., localhost
  user: process.env.DB_USER, // Database user
  database: process.env.DB_NAME, // Database name
  password: process.env.DB_PASSWORD, // Database password
  port: process.env.DB_PORT || 3306, // Default MySQL port
  connectionLimit: process.env.CONLIMIT || 10, // Optional, set connection limit
});

// Export the pool for use in other files
module.exports = pool;

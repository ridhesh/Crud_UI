const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'laundry_db',
  charset: 'utf8mb4',
  timezone: 'local',
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed: ' + err.stack);
    console.error('💡 Please check:');
    console.error('   - Database name: laundry_db');
    console.error('   - MySQL server is running');
    console.error('   - Username and password are correct');
    console.error('   - Database exists');
    process.exit(1);
  }
  console.log('✅ Connected to database as id ' + connection.threadId);
  console.log('📊 Database: ' + (process.env.DB_NAME || 'laundry_db'));
  console.log('🏠 Host: ' + (process.env.DB_HOST || 'localhost'));
});

// Handle connection errors
connection.on('error', (err) => {
  console.error('❌ Database error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('🔁 Database connection was lost. Attempting to reconnect...');
    // Implement reconnection logic if needed
  } else {
    throw err;
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Closing database connection...');
  connection.end((err) => {
    if (err) {
      console.error('Error closing database connection:', err);
    } else {
      console.log('✅ Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = connection;
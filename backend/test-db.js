const db = require('./config/database');

console.log('🧪 Testing database connection...');

db.query('SELECT DATABASE() as db_name', (err, results) => {
  if (err) {
    console.error('❌ Database test failed:', err);
    return;
  }
  
  console.log('✅ Connected to database:', results[0].db_name);
  
  // Test if tables exist
  db.query('SHOW TABLES', (err, tables) => {
    if (err) {
      console.error('❌ Error listing tables:', err);
      return;
    }
    
    console.log('📊 Tables in database:');
    tables.forEach(table => {
      console.log('   -', table[Object.keys(table)[0]]);
    });
    
    process.exit(0);
  });
});
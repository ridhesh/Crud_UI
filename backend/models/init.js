const db = require('../config/database');

const initDatabase = () => {
  console.log('🔄 Initializing database...');

  const createCustomersTable = `
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255),
      address TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      service_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      price_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
      status ENUM('Received', 'In Progress', 'Completed', 'Delivered') DEFAULT 'Received',
      priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
      notes TEXT,
      created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `;

  const createServicesTable = `
    CREATE TABLE IF NOT EXISTS services (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      base_price DECIMAL(10,2) NOT NULL,
      estimated_time_hours INT DEFAULT 24,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Create tables
  const tables = [
    { name: 'customers', sql: createCustomersTable },
    { name: 'orders', sql: createOrdersTable },
    { name: 'services', sql: createServicesTable }
  ];

  tables.forEach(table => {
    db.query(table.sql, (err) => {
      if (err) {
        console.error(`❌ Error creating ${table.name} table:`, err);
        return;
      }
      console.log(`✅ ${table.name} table ready`);
    });
  });

  // Insert default data after a short delay to ensure tables are created
  setTimeout(() => {
    insertDefaultData();
  }, 1000);
};

const insertDefaultData = () => {
  // Insert default services
  const insertServices = `
    INSERT IGNORE INTO services (name, description, base_price, estimated_time_hours) VALUES
    ('Wash & Fold', 'Regular washing and folding service', 5.00, 24),
    ('Dry Cleaning', 'Professional dry cleaning', 12.00, 48),
    ('Ironing', 'Ironing service only', 3.00, 12),
    ('Stain Removal', 'Special stain treatment', 8.00, 24),
    ('Express Service', 'Priority service with faster turnaround', 15.00, 6)
  `;

  db.query(insertServices, (err) => {
    if (err) {
      console.error('❌ Error inserting services:', err);
    } else {
      console.log('✅ Default services created');
    }
  });
};

module.exports = initDatabase;
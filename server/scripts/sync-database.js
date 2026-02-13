require('dotenv').config();
const db = require('../src/models');

const syncDatabase = async () => {
  try {
    console.log('🔄 Starting database synchronization...');
    
    // Test database connection
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync all models with the database
    // force: true will drop tables and recreate them
    // alter: true will update tables to match models without dropping data
    await db.sequelize.sync({ force: true });
    
    console.log('✅ All models were synchronized successfully.');
    console.log('📊 Database cleared and updated.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    process.exit(1);
  }
};

syncDatabase();

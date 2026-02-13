require('dotenv').config();
const db = require('./src/models');

const checkDatabase = async () => {
  try {
    console.log('🔍 Checking database connection...\n');
    
    // Test authentication
    await db.sequelize.authenticate();
    console.log('✅ Database connection established successfully.\n');
    
    // Get database name
    const dbName = db.sequelize.config.database;
    console.log(`📊 Database: ${dbName}\n`);
    
    // List all models
    console.log('📋 Available Models:');
    Object.keys(db).forEach(modelName => {
      if (modelName !== 'sequelize' && modelName !== 'Sequelize') {
        console.log(`   - ${modelName}`);
      }
    });
    console.log('');
    
    // Get table information
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    
    console.log('📁 Database Tables:');
    if (tables.length === 0) {
      console.log('   No tables found. Run npm run db:sync to create tables.');
    } else {
      tables.forEach(table => console.log(`   - ${table}`));
    }
    console.log('');
    
    // Get row counts for each table
    if (tables.length > 0) {
      console.log('📊 Table Row Counts:');
      for (const table of tables) {
        try {
          const [results] = await db.sequelize.query(`SELECT COUNT(*) as count FROM ${table}`);
          console.log(`   - ${table}: ${results[0].count} rows`);
        } catch (error) {
          console.log(`   - ${table}: Unable to count rows`);
        }
      }
    }
    
    console.log('\n✅ Database check completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
    process.exit(1);
  }
};

checkDatabase();

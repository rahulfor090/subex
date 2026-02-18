'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// Initialize Sequelize with environment variables if available
if (process.env.DB_NAME) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: config.dialect || 'mysql',
      logging: config.logging === true ? console.log : false,
      pool: config.pool || {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // Fallback to config.json
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Load all model files from this directory
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define relationships
if (db.Subscription && db.Company) {
  db.Subscription.belongsTo(db.Company, {
    foreignKey: 'company_id',
    as: 'company'
  });
  db.Company.hasMany(db.Subscription, {
    foreignKey: 'company_id',
    as: 'subscriptions'
  });
}

if (db.Subscription && db.Folder) {
  db.Subscription.belongsTo(db.Folder, {
    foreignKey: 'folder_id',
    as: 'folder'
  });
  db.Folder.hasMany(db.Subscription, {
    foreignKey: 'folder_id',
    as: 'subscriptions'
  });
}

if (db.Subscription && db.Tag && db.SubscriptionTag) {
  db.Subscription.belongsToMany(db.Tag, {
    through: db.SubscriptionTag,
    foreignKey: 'subscription_id',
    otherKey: 'tag_id',
    as: 'tags'
  });
  db.Tag.belongsToMany(db.Subscription, {
    through: db.SubscriptionTag,
    foreignKey: 'tag_id',
    otherKey: 'subscription_id',
    as: 'subscriptions'
  });
}

// Associations
// User <-> Subscription
if (db.User && db.Subscription) {
  db.User.hasMany(db.Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
  db.Subscription.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

// Subscription <-> Alert (One-to-Many)
if (db.Subscription && db.Alert) {
  db.Subscription.hasMany(db.Alert, { foreignKey: 'subscription_id', as: 'alerts', onDelete: 'CASCADE' });
  db.Alert.belongsTo(db.Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
}

// SubExAlert Associations
if (db.Alert && db.SubExAlert) {
  db.Alert.hasMany(db.SubExAlert, { foreignKey: 'alert_id', as: 'scheduled_alerts', onDelete: 'CASCADE' });
  db.SubExAlert.belongsTo(db.Alert, { foreignKey: 'alert_id', as: 'alert_configuration' });
}

if (db.Subscription && db.SubExAlert) {
  db.Subscription.hasMany(db.SubExAlert, { foreignKey: 'subscription_id', as: 'subscription_alerts', onDelete: 'CASCADE' });
  db.SubExAlert.belongsTo(db.Subscription, { foreignKey: 'subscription_id', as: 'subscription' });
}

if (db.User && db.SubExAlert) {
  db.User.hasMany(db.SubExAlert, { foreignKey: 'user_id', as: 'user_alerts' });
  db.SubExAlert.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

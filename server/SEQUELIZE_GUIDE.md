# SubEx Server - Sequelize Setup

## Overview
This server uses Sequelize ORM for database management with MySQL.

## Project Structure
```
server/
├── src/
│   ├── config/
│   │   ├── config.json       # Sequelize configuration
│   │   └── database.js       # Legacy connection (can be removed)
│   ├── migrations/           # Database migrations
│   ├── models/              # Sequelize models
│   │   ├── index.js         # Model initialization
│   │   ├── User.js          # User model example
│   │   └── Article.js       # Article model example
│   ├── seeders/             # Database seeders
│   ├── services/            # Business logic services
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   └── index.js            # Server entry point
├── scripts/
│   └── sync-database.js    # Database sync script
├── .sequelizerc            # Sequelize CLI configuration
├── .env.example            # Environment variables template
├── check_db.js             # Database check utility
└── package.json
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```
**Note:** The `postinstall` script will automatically sync the database after installation.

### 2. Configure Environment Variables
Create a `.env` file in the server root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=subex_dev
DB_PORT=3306
```

### 3. Database Setup
The database will be automatically synchronized when you run `npm install`. 

## Available Scripts

- `npm start` - Start the server
- `npm run dev` - Start the server in development mode
- `npm run db:sync` - Sync database (clears and recreates tables)
- `npm run db:reset` - Reset database (same as db:sync)
- `npm run db:check` - Check database connection and table status

## Sequelize CLI Commands

### Migrations
```bash
# Create a new migration
npx sequelize-cli migration:generate --name migration-name

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all
```

### Seeders
```bash
# Create a new seeder
npx sequelize-cli seed:generate --name seeder-name

# Run all seeders
npx sequelize-cli db:seed:all

# Undo last seeder
npx sequelize-cli db:seed:undo

# Undo all seeders
npx sequelize-cli db:seed:undo:all
```

### Models
```bash
# Create a new model with migration
npx sequelize-cli model:generate --name ModelName --attributes field1:string,field2:integer
```

## Creating Models

Models are defined in `src/models/` directory. Example:

```javascript
'use strict';

module.exports = (sequelize, DataTypes) => {
  const ModelName = sequelize.define('ModelName', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    field1: {
      type: DataTypes.STRING,
      allowNull: false
    },
    field2: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'table_name',
    timestamps: true,
    underscored: true
  });

  ModelName.associate = function(models) {
    // Define associations here
  };

  return ModelName;
};
```

## Model Associations

Define relationships in the `associate` function:

```javascript
// One-to-Many
User.hasMany(models.Article, { foreignKey: 'userId', as: 'articles' });
Article.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });

// Many-to-Many
User.belongsToMany(models.Role, { through: 'UserRoles' });
Role.belongsToMany(models.User, { through: 'UserRoles' });
```

## Using Models in Controllers/Routes

```javascript
const db = require('./models');

// Create
const user = await db.User.create({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'hashed_password'
});

// Find
const user = await db.User.findByPk(1);
const users = await db.User.findAll();

// Update
await db.User.update(
  { username: 'new_name' },
  { where: { id: 1 } }
);

// Delete
await db.User.destroy({ where: { id: 1 } });

// With associations
const user = await db.User.findByPk(1, {
  include: [{
    model: db.Article,
    as: 'articles'
  }]
});
```

## Database Sync Behavior

⚠️ **Important:** The `postinstall` script uses `sync({ force: true })` which **drops and recreates** all tables. This is useful for development but **dangerous in production**.

### For Development
Keep the current setup with `force: true` for automatic schema updates.

### For Production
Modify `scripts/sync-database.js`:
```javascript
// Use migrations instead
await db.sequelize.sync({ force: false, alter: false });
```

Or remove the `postinstall` script and use migrations:
```bash
npx sequelize-cli db:migrate
```

## API Endpoints

### Health Check
- `GET /` - Server status
- `GET /health/db` - Database connection status

## Configuration

### Database Configuration
Edit `src/config/config.json` for different environments:
- `development` - Local development
- `test` - Testing environment
- `production` - Production environment

The models/index.js will prioritize environment variables over config.json.

## Troubleshooting

### Database Connection Issues
1. Ensure MySQL server is running
2. Verify credentials in `.env` file
3. Check if database exists: `CREATE DATABASE subex_dev;`
4. Run `npm run db:check` to diagnose issues

### Migration Issues
```bash
# Reset migrations
npx sequelize-cli db:migrate:undo:all
npx sequelize-cli db:migrate
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Best Practices

1. **Always use migrations in production** - Don't rely on `sync()`
2. **Never commit `.env` file** - Keep credentials secure
3. **Use transactions** for complex operations
4. **Validate data** in models using Sequelize validators
5. **Use indexes** for frequently queried fields
6. **Implement soft deletes** with `paranoid: true`

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize CLI](https://github.com/sequelize/cli)
- [MySQL Documentation](https://dev.mysql.com/doc/)

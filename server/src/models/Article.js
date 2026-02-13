'use strict';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    excerpt: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    featuredImage: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'featured_image'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'articles',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['slug']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      }
    ]
  });

  Article.associate = function(models) {
    // Define associations here
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
  };

  return Article;
};

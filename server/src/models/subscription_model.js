// models/subscription_model.js

module.exports = (sequelize, DataTypes) => {
  const Subscription = sequelize.define("Subscription", {

    subscription_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    company_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id'
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    type: {
      type: DataTypes.ENUM('subscription', 'trial', 'lifetime', 'revenue'),
      allowNull: false,
      defaultValue: 'subscription'
    },

    recurring: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    frequency: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      comment: 'Number of billing cycles'
    },

    cycle: {
      type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'yearly'),
      allowNull: false,
      defaultValue: 'monthly'
    },

    listed_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      comment: 'Cost/price of the subscription'
    },

    purchase_price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Amount actually paid for the subscription'
    },

    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'USD'
    },

    next_payment_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    grace_period: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    url_link: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    folder_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'folders',
        key: 'id'
      }
    },

    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }

  }, {
    tableName: "subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Subscription;
};

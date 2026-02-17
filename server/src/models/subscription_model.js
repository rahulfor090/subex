// models/subscription.model.js

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

    service_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    description: DataTypes.TEXT,

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    next_renewal_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    billing_cycle_number: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },

    billing_cycle_period: {
      type: DataTypes.ENUM("daily", "weekly", "monthly", "yearly"),
      allowNull: false
    },

    auto_renew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    cost: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },

    currency: {
      type: DataTypes.STRING(10),
      allowNull: false
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    is_trial: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    website_url: DataTypes.STRING(255),
    category: DataTypes.STRING(100),

    plan_id: {
      type: DataTypes.BIGINT,
      allowNull: true // nullable for user-tracked subscriptions without a plan
    }

  }, {
    tableName: "subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  Subscription.associate = function (models) {
    Subscription.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Subscription.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
    Subscription.hasMany(models.Transaction, { foreignKey: 'subscription_id', as: 'transactions' });
  };

  return Subscription;
};

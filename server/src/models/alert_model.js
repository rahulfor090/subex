// models/alert_model.js

module.exports = (sequelize, DataTypes) => {
  const Alert = sequelize.define("Alert", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'subscriptions',
        key: 'subscription_id'
      }
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: { min: 1 },
      comment: 'Number of units (days/weeks/months) before the alert_on date'
    },

    unit: {
      type: DataTypes.ENUM('day', 'week', 'month'),
      allowNull: false,
      defaultValue: 'day',
      comment: 'Unit of time for the alert period'
    },

    alert_on: {
      type: DataTypes.ENUM('payment_date', 'grace_period'),
      allowNull: false,
      defaultValue: 'payment_date',
      comment: 'Which date to alert on'
    },

    contact: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Contact info (email/phone) to send the alert to'
    }

  }, {
    tableName: "alerts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Alert;
};

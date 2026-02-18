module.exports = (sequelize, DataTypes) => {
  const SubExAlert = sequelize.define("SubExAlert", {
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
    alert_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'alerts',
        key: 'id'
      }
    },
    alert_send_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Calculated date when the alert should be sent'
    },
    status: {
      type: DataTypes.ENUM('pending', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Status of the alert'
    }
  }, {
    tableName: "subex_alerts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return SubExAlert;
};

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
      type: DataTypes.ENUM('pending', 'processing', 'sent', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Status of the alert'
    },
    retry_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Number of retry attempts'
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Timestamp when the email was successfully sent'
    }
  }, {
    tableName: "subex_alerts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: 'idx_alert_due',
        fields: ['alert_send_date', 'status']
      }
    ]
  });

  return SubExAlert;
};

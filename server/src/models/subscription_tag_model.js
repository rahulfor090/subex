// models/subscription_tag_model.js

module.exports = (sequelize, DataTypes) => {
  const SubscriptionTag = sequelize.define("SubscriptionTag", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    subscription_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'subscriptions',
        key: 'subscription_id'
      }
    },

    tag_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      }
    }

  }, {
    tableName: "subscription_tags",
    timestamps: false
  });

  return SubscriptionTag;
};

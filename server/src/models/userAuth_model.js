// models/userAuth.model.js

module.exports = (sequelize, DataTypes) => {
  const UserAuth = sequelize.define("UserAuth", {

    auth_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false
    },

    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    failed_login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },

    account_locked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    last_login: {
      type: DataTypes.DATE
    }

  }, {
    tableName: "user_auth",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return UserAuth;
};

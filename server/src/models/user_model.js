// models/user.model.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },

    phone_number: {
      type: DataTypes.STRING(20),
      unique: true
    },

    date_of_birth: {
      type: DataTypes.DATEONLY
    },

    address_line1: DataTypes.STRING(255),
    address_line2: DataTypes.STRING(255),
    city: DataTypes.STRING(100),
    state: DataTypes.STRING(100),
    country: DataTypes.STRING(100),
    zip_code: DataTypes.STRING(20),

    role: {
      type: DataTypes.ENUM('user', 'admin', 'super_admin'),
      defaultValue: 'user',
      allowNull: false
    },

    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }

  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  User.associate = function (models) {
    User.hasMany(models.Subscription, { foreignKey: 'user_id', as: 'subscriptions' });
    User.hasMany(models.Transaction, { foreignKey: 'user_id', as: 'transactions' });
    User.hasOne(models.UserAuth, { foreignKey: 'user_id', as: 'auth' });
  };

  return User;
};

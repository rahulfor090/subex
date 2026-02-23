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

    profile_picture: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    role: {
      type: DataTypes.ENUM('user', 'admin', 'super_admin'),
      defaultValue: 'user',
      allowNull: false
    },

    status: {
      type: DataTypes.ENUM('active', 'suspended', 'banned'),
      defaultValue: 'active',
      allowNull: false
    }

  }, {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    // Paranoid mode: destroy() sets deleted_at instead of deleting
    paranoid: true,
    deletedAt: "deleted_at"
  });

  return User;
};

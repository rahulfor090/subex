// models/company_model.js

module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define("Company", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to company logo'
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }

  }, {
    tableName: "companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Company;
};

// models/folder_model.js

module.exports = (sequelize, DataTypes) => {
  const Folder = sequelize.define("Folder", {

    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }

  }, {
    tableName: "folders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Folder;
};

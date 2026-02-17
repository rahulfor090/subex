// models/tag_model.js

module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define("Tag", {

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
    tableName: "tags",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  });

  return Tag;
};

"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class TypeDocument extends Model {}

  TypeDocument.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "TypeDocument",
      tableName: "TypeDocuments",
      timestamps: true,
    }
  );

  TypeDocument.associate = (models) => {
    TypeDocument.hasMany(models.Document, {
      foreignKey: "typeId",
      as: "documents",
    });
  };

  return TypeDocument;
};

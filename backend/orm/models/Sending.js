"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Sending extends Model {}

  Sending.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      documentIds: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Sending",
      tableName: "Sendings",
      timestamps: true,
    }
  );

  Sending.associate = (models) => {
    Sending.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
      onDelete: "CASCADE",
    });
  };

  return Sending;
};

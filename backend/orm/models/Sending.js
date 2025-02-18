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
      type: {
        type: DataTypes.ENUM("CEDIG", "DOE"),
        allowNull: false,
        defaultValue: "CEDIG",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
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
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "Projects",
          key: "id",
        },
        onDelete: "SET NULL",
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
      onDelete: "SET NULL",
    });
  };

  return Sending;
};

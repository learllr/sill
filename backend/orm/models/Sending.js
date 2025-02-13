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
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.STRING,
        allowNull: false,
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

  return Sending;
};

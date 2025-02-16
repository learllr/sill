"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class SignatureStamp extends Model {}

  SignatureStamp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SignatureStamp",
      tableName: "SignatureStamps",
      timestamps: true,
    }
  );

  return SignatureStamp;
};

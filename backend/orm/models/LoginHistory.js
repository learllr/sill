"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class LoginHistory extends Model {}

  LoginHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      loginAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "LoginHistory",
      tableName: "LoginHistory",
      timestamps: false,
    }
  );

  LoginHistory.associate = (models) => {
    LoginHistory.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return LoginHistory;
};

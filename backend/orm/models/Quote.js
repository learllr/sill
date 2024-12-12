"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Quote extends Model {}

  Quote.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true,
        },
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients",
          key: "id",
        },
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      lot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Accepted", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      quoteNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      sentOn: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Quote",
      tableName: "Quotes",
      timestamps: true,
    }
  );

  Quote.associate = (models) => {
    Quote.belongsTo(models.Client, {
      foreignKey: "clientId",
      as: "client",
    });

    Quote.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return Quote;
};

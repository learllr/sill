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
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Participants",
          key: "id",
        },
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
        type: DataTypes.ENUM("En attente", "Accepté", "Rejeté"),
        allowNull: false,
        defaultValue: "En attente",
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
        type: DataTypes.STRING,
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
    Quote.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
      onDelete: "SET NULL",
    });

    Quote.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
      onDelete: "SET NULL",
    });
  };

  return Quote;
};

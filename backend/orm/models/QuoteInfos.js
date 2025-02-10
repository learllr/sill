"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class QuoteInfos extends Model {}

  QuoteInfos.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      documentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Documents",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Participants",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Projects",
          key: "id",
        },
        onDelete: "SET NULL",
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
        allowNull: true,
      },
      sentOn: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "QuoteInfos",
      tableName: "QuoteInfos",
      timestamps: true,
    }
  );

  QuoteInfos.associate = (models) => {
    QuoteInfos.belongsTo(models.Document, {
      foreignKey: "documentId",
      as: "document",
      onDelete: "CASCADE",
    });

    QuoteInfos.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
      onDelete: "SET NULL",
    });

    QuoteInfos.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
      onDelete: "SET NULL",
    });
  };

  return QuoteInfos;
};

"use strict";
import { DataTypes, Model } from "sequelize";
import { DocumentType } from "../../../shared/constants/types.js";
import { Months } from "../../../shared/constants/general.js";

export default (sequelize) => {
  class Document extends Model {}

  Document.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(DocumentType)),
        allowNull: false,
      },
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Participants",
          key: "id",
        },
        onDelete: "SET NULL",
        defaultValue: null,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Projects",
          key: "id",
        },
        onDelete: "SET NULL",
        defaultValue: null,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 2000,
        },
      },
      month: {
        type: DataTypes.ENUM(...Object.values(Months)),
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Document",
      tableName: "Documents",
      timestamps: true,
    }
  );

  Document.associate = (models) => {
    Document.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
    });

    Document.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return Document;
};

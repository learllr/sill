"use strict";
import { DataTypes, Model } from "sequelize";
import { DocumentType } from "../../../shared/constants/types.js";

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
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(DocumentType)),
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Employees",
          key: "id",
        },
        onDelete: "SET NULL",
        defaultValue: null,
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: true,
        },
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          notEmpty: true,
        },
      },
      pvType: {
        type: DataTypes.ENUM("Avec réserves", "Sans réserves"),
        allowNull: true,
        defaultValue: null,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    Document.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });

    Document.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
    });

    Document.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });

    Document.hasMany(models.InvoiceInfos, {
      foreignKey: "documentId",
      as: "invoiceInfos",
      onDelete: "CASCADE",
    });

    Document.hasMany(models.QuoteInfos, {
      foreignKey: "documentId",
      as: "quoteInfos",
      onDelete: "CASCADE",
    });
  };

  return Document;
};

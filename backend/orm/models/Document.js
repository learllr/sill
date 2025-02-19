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
      },
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // Si un Employee est supprimé, supprimer aussi les Documents associés
    Document.belongsTo(models.Employee, {
      foreignKey: { name: "employeeId", allowNull: true },
      as: "employee",
      onDelete: "CASCADE",
    });

    // Si un Participant est supprimé, supprimer aussi les Documents associés
    Document.belongsTo(models.Participant, {
      foreignKey: { name: "participantId", allowNull: true },
      as: "participant",
      onDelete: "CASCADE",
    });

    // Si un Project est supprimé, supprimer aussi les Documents associés
    Document.belongsTo(models.Project, {
      foreignKey: { name: "projectId", allowNull: true },
      as: "project",
      onDelete: "CASCADE",
    });

    // Un Document peut avoir un seul InvoiceInfos (CASCADE si supprimé)
    Document.hasOne(models.InvoiceInfos, {
      foreignKey: { name: "documentId", allowNull: false },
      as: "invoiceInfos",
      onDelete: "CASCADE",
    });

    // Un Document peut avoir un seul QuoteInfos (CASCADE si supprimé)
    Document.hasOne(models.QuoteInfos, {
      foreignKey: { name: "documentId", allowNull: false },
      as: "quoteInfos",
      onDelete: "CASCADE",
    });
  };

  return Document;
};

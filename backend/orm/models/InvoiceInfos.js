"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class InvoiceInfos extends Model {}

  InvoiceInfos.init(
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
      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paidOn: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.ENUM,
        values: ["Virement", "Chèque"],
        allowNull: false,
        defaultValue: "Virement",
      },
      RG: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      prorata: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      finalCompletion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "InvoiceInfos",
      tableName: "InvoiceInfos",
      timestamps: true,
    }
  );

  InvoiceInfos.associate = (models) => {
    InvoiceInfos.belongsTo(models.Document, {
      foreignKey: "documentId",
      as: "document",
      onDelete: "CASCADE",
    });

    InvoiceInfos.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
      onDelete: "SET NULL",
    });

    InvoiceInfos.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
      onDelete: "SET NULL",
    });
  };

  return InvoiceInfos;
};

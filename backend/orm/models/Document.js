"use strict";
import { DataTypes, Model } from "sequelize";

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
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TypeDocuments",
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
    Document.belongsTo(models.TypeDocument, {
      foreignKey: "typeId",
      as: "type",
    });

    Document.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return Document;
};

"use strict";
import { DataTypes, Model } from "sequelize";
import { ParticipantType } from "../../../shared/constants/types.js";

export default (sequelize) => {
  class Participant extends Model {}

  Participant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM(...Object.values(ParticipantType)),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
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
      modelName: "Participant",
      tableName: "Participants",
      timestamps: true,
    }
  );

  Participant.associate = (models) => {
    Participant.belongsToMany(models.Project, {
      through: models.ProjectParticipant,
      foreignKey: "participantId",
      otherKey: "projectId",
      as: "projects",
      onDelete: "CASCADE",
    });

    Participant.hasMany(models.ContactPerson, {
      foreignKey: "participantId",
      as: "contactPersons",
      onDelete: "CASCADE",
    });

    Participant.hasMany(models.InvoiceInfos, {
      foreignKey: "documentId",
      as: "invoices",
      onDelete: "CASCADE",
    });

    Participant.hasMany(models.QuoteInfos, {
      foreignKey: "documentId",
      as: "quotes",
      onDelete: "CASCADE",
    });
  };

  return Participant;
};

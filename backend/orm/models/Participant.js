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
      onDelete: "SET NULL",
    });

    Participant.hasMany(models.Quote, {
      foreignKey: "participantId",
      as: "quotes",
      onDelete: "SET NULL",
    });

    Participant.hasMany(models.Invoice, {
      foreignKey: "participantId",
      as: "invoices",
      onDelete: "SET NULL",
    });

    Participant.hasMany(models.ContactPerson, {
      foreignKey: "participantId",
      as: "contactPersons",
      onDelete: "CASCADE",
    });
  };

  return Participant;
};

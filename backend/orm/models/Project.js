"use strict";
import { DataTypes, Model } from "sequelize";
import { ParticipantType } from "../../../shared/constants/types.js";

export default (sequelize) => {
  class Project extends Model {}

  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      status: {
        type: DataTypes.ENUM("Non commencé", "En cours", "Terminé", "Annulé"),
        allowNull: false,
        defaultValue: "Non commencé",
      },
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "Projects",
      timestamps: true,
    }
  );

  Project.associate = (models) => {
    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "clients",
      scope: { type: ParticipantType.CLIENT },
      onDelete: "CASCADE",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "suppliers",
      scope: { type: ParticipantType.FOURNISSEUR },
      onDelete: "CASCADE",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "subcontractors",
      scope: { type: ParticipantType.SOUS_TRAITANT },
      onDelete: "CASCADE",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "architects",
      scope: { type: ParticipantType.ARCHITECTE },
      onDelete: "CASCADE",
    });
  };

  return Project;
};

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
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Participants",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    // Un projet a un client principal (Participant), qui peut être NULL si supprimé
    Project.belongsTo(models.Participant, {
      foreignKey: "clientId",
      as: "client",
      onDelete: "SET NULL",
    });

    // Un projet peut avoir plusieurs clients associés via une table intermédiaire (ProjectParticipant)
    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "clients",
      scope: { type: ParticipantType.CLIENT },
      onDelete: "CASCADE",
    });

    // Un projet peut avoir plusieurs fournisseurs associés via une table intermédiaire (ProjectParticipant)
    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "suppliers",
      scope: { type: ParticipantType.FOURNISSEUR },
      onDelete: "CASCADE",
    });

    // Un projet peut avoir plusieurs sous-traitants via une table intermédiaire (ProjectParticipant)
    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "subcontractors",
      scope: { type: ParticipantType.SOUS_TRAITANT },
      onDelete: "CASCADE",
    });

    // Un projet peut avoir plusieurs architectes via une table intermédiaire (ProjectParticipant)
    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "architects",
      scope: { type: ParticipantType.ARCHITECTE },
      onDelete: "CASCADE",
    });

    // Un projet peut avoir plusieurs documents (Factures, Devis, etc.), supprimés en cascade si le projet est supprimé
    Project.hasMany(models.Document, {
      foreignKey: { name: "projectId", allowNull: true },
      as: "documents",
      onDelete: "CASCADE",
    });
  };

  return Project;
};

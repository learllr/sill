"use strict";
import { DataTypes, Model } from "sequelize";

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
        type: DataTypes.ENUM("Non commencé", "En cours", "Terminé"),
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
      scope: { typeId: 1 },
      onDelete: "SET NULL",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "suppliers",
      scope: { typeId: 2 },
      onDelete: "SET NULL",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "subcontractors",
      scope: { typeId: 3 },
      onDelete: "SET NULL",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "architects",
      scope: { typeId: 4 },
      onDelete: "SET NULL",
    });
  };

  return Project;
};

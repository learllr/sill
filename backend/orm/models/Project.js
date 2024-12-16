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
    },
    {
      sequelize,
      modelName: "Project",
      tableName: "Projects",
      timestamps: true,
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.Client, {
      foreignKey: "billingClientId",
      as: "client",
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "suppliers",
      scope: { typeId: 1 },
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "subcontractors",
      scope: { typeId: 2 },
    });

    Project.belongsToMany(models.Participant, {
      through: models.ProjectParticipant,
      foreignKey: "projectId",
      otherKey: "participantId",
      as: "architects",
      scope: { typeId: 4 },
    });
  };

  return Project;
};

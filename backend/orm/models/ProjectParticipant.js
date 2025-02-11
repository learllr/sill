"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class ProjectParticipant extends Model {}

  ProjectParticipant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
      },
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Participants",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ProjectParticipant",
      tableName: "ProjectParticipants",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["projectId", "participantId"],
        },
      ],
    }
  );

  ProjectParticipant.associate = (models) => {
    ProjectParticipant.belongsTo(models.Project, {
      foreignKey: "projectId",
      onDelete: "CASCADE",
    });

    ProjectParticipant.belongsTo(models.Participant, {
      foreignKey: "participantId",
      onDelete: "CASCADE",
    });
  };

  return ProjectParticipant;
};

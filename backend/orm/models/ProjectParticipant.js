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
        allowNull: true,
        references: {
          model: "Projects",
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
        onDelete: "CASCADE",
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

  return ProjectParticipant;
};

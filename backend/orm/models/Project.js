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
      billingClientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients",
          key: "id",
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
      as: "billingClient",
    });

    Project.hasMany(models.TypeParticipant, {
      foreignKey: "projectId",
      as: "participantProjects",
    });
  };

  return Project;
};

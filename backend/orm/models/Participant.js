"use strict";
import { DataTypes, Model } from "sequelize";

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
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TypeParticipants",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 100],
        },
      },
      contactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
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
    Participant.belongsTo(models.TypeParticipant, {
      foreignKey: "typeId",
      as: "type",
    });

    Participant.belongsToMany(models.Project, {
      through: models.ProjectParticipant,
      foreignKey: "participantId",
      otherKey: "projectId",
      as: "projects",
    });
  };

  return Participant;
};

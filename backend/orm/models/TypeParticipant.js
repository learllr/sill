"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class TypeParticipant extends Model {}

  TypeParticipant.init(
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
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
    },
    {
      sequelize,
      modelName: "TypeParticipant",
      tableName: "TypeParticipants",
      timestamps: true,
    }
  );

  TypeParticipant.associate = (models) => {
    TypeParticipant.hasMany(models.Participant, {
      foreignKey: "typeId",
      as: "participants",
    });
  };

  return TypeParticipant;
};

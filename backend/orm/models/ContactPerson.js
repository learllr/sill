"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class ContactPerson extends Model {}

  ContactPerson.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      participantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Participants",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ContactPerson",
      tableName: "ContactPersons",
      timestamps: true,
    }
  );

  ContactPerson.associate = (models) => {
    ContactPerson.belongsTo(models.Participant, {
      foreignKey: "participantId",
      as: "participant",
      onDelete: "CASCADE",
    });
  };

  return ContactPerson;
};

"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Client extends Model {}

  Client.init(
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
      contactPerson: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9]{10}$/,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Client",
      tableName: "Clients",
      timestamps: true,
    }
  );

  Client.associate = (models) => {
    Client.hasMany(models.Project, {
      foreignKey: "billingClientId",
      as: "projects",
    });

    Client.hasMany(models.Quote, {
      foreignKey: "clientId",
      as: "quotes",
    });

    Client.hasMany(models.Invoice, {
      foreignKey: "clientId",
      as: "invoices",
    });
  };

  return Client;
};

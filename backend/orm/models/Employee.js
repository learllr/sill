"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Employee extends Model {}

  Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      gender: {
        type: DataTypes.ENUM(["Homme", "Femme"]),
        allowNull: false,
        defaultValue: "Homme",
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthCity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      familyStatus: {
        type: DataTypes.ENUM("Célibataire", "Marié", "Vie maritale"),
        allowNull: true,
      },
      dependentChildren: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      socialSecurityNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
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
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      qualification: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contractType: {
        type: DataTypes.ENUM(
          "CDD",
          "CDI",
          "Contrat d'apprentissage",
          "Contrat de professionnalisation"
        ),
        allowNull: true,
      },
      contractDurationMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workTime: {
        type: DataTypes.ENUM("Temps plein", "Temps partiel", "Mi-temps"),
        allowNull: true,
      },
      monthlyNetSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      weeklyHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      btpCard: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      medicalCheckupDate: {
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
      modelName: "Employee",
      tableName: "Employees",
      timestamps: true,
    }
  );

  Employee.associate = (models) => {
    Employee.hasMany(models.Document, {
      foreignKey: "employeeId",
      as: "documents",
    });
  };

  return Employee;
};

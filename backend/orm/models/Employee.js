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
        defaultValue: null,
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
        defaultValue: null,
      },
      contractDurationMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workTime: {
        type: DataTypes.ENUM("Temps plein", "Temps partiel", "Mi-temps"),
        allowNull: true,
        defaultValue: null,
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
      },
      medicalCheckupDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
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
    Employee.hasMany(models.LeaveRequest, {
      foreignKey: "employeeId",
      as: "leaveRequests",
    });
    Employee.hasMany(models.Document, {
      foreignKey: "employeeId",
      as: "documents",
    });
  };

  return Employee;
};

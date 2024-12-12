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
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      birthCity: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 50],
        },
      },
      familyStatus: {
        type: DataTypes.ENUM("Single", "Married", "Domestic Partnership"),
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
        validate: {
          len: [15, 15],
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [5, 10],
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 100],
        },
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
          "Apprenticeship",
          "Professionalization"
        ),
        allowNull: false,
      },
      contractDurationMonths: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      workTime: {
        type: DataTypes.ENUM("Full-time", "Part-time", "Half-time"),
        allowNull: false,
      },
      monthlyNetSalary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      weeklyHours: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 35,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      btpCard: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      medicalCheckupDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

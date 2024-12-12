"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class LeaveRequest extends Model {}

  LeaveRequest.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Employees",
          key: "id",
        },
      },
      leaveType: {
        type: DataTypes.ENUM(
          "Paid Leave",
          "Sick Leave",
          "Unpaid Leave",
          "Special Leave"
        ),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
        allowNull: false,
        defaultValue: "Pending",
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "LeaveRequest",
      tableName: "LeaveRequests",
      timestamps: true,
    }
  );

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: "employeeId",
      as: "employee",
    });
  };

  return LeaveRequest;
};

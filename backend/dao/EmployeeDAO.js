import db from "../orm/models/index.js";
const { Employee } = db;

export default class EmployeeDAO {
  static async getAllEmployees() {
    return await Employee.findAll({
      attributes: ["id", "firstName", "lastName", "jobTitle", "createdAt"],
    });
  }

  static async getEmployeeById(id) {
    return await Employee.findOne({
      where: { id },
      attributes: { exclude: ["updatedAt"] },
    });
  }

  static async updateEmployee(id, updatedData) {
    const employee = await Employee.findOne({ where: { id } });
    if (employee) {
      return await employee.update(updatedData);
    }
    return null;
  }

  static async deleteEmployee(id) {
    return await Employee.destroy({ where: { id } });
  }
}
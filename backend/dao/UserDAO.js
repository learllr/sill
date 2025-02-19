import db from "../orm/models/index.js";
const { User, Role } = db;

export default class UserDAO {
  static async getUserById(id) {
    return await User.findByPk(id);
  }

  static async getAllUsers() {
    return await User.findAll();
  }

  static async createUser(userData) {
    return await User.create(userData);
  }

  static async updateUser(user, updatedData) {
    return await user.update(updatedData);
  }

  static async deleteUser(user) {
    return await user.destroy();
  }

  static async getAllRoles() {
    return await Role.findAll();
  }
}

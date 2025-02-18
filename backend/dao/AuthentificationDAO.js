import db from "../orm/models/index.js";

const { User, LoginHistory } = db;

export default class AuthentificationDAO {
  static async findUserByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  static async updateUserPassword(userId, hashedPassword) {
    return await User.update(
      { password: hashedPassword },
      { where: { id: userId } }
    );
  }

  static async createLoginRecord(userId) {
    return await LoginHistory.create({ userId });
  }

  static async getUserLoginHistory(userId) {
    return await LoginHistory.findAll({
      where: { userId },
      order: [["loginAt", "DESC"]],
    });
  }

  static async getAllLoginHistory() {
    return await LoginHistory.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName"],
      },
      order: [["loginAt", "DESC"]],
    });
  }

  static async deleteLoginRecords(ids) {
    return await LoginHistory.destroy({ where: { id: ids } });
  }
}

import db from "../orm/models/index.js";
const { Participant } = db;

export default class ParticipantDAO {
  static async getAllParticipantsByType(typeId) {
    return await Participant.findAll({
      where: { typeId },
      attributes: [
        "id",
        "name",
        "typeId",
        "contactPerson",
        "phone",
        "email",
        "address",
        "website",
        "updatedAt",
        "createdAt",
      ],
    });
  }

  static async getParticipantByIdAndType(id, typeId) {
    return await Participant.findOne({
      where: { id, typeId },
      attributes: [
        "id",
        "name",
        "typeId",
        "contactPerson",
        "phone",
        "email",
        "address",
        "website",
        "updatedAt",
        "createdAt",
      ],
    });
  }

  static async createParticipant(data) {
    return await Participant.create(data);
  }

  static async updateParticipant(id, typeId, updatedData) {
    return await Participant.update(updatedData, {
      where: { id, typeId },
    });
  }

  static async deleteParticipant(participant) {
    return await participant.destroy();
  }
}

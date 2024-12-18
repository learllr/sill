import db from "../orm/models/index.js";
const { Participant, TypeParticipant } = db;

export default class ParticipantDAO {
  static async getAllParticipantsByType(typeId) {
    return await Participant.findAll({
      where: { typeId },
      attributes: [
        "id",
        "name",
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

  static async getTypeNameById(typeId) {
    return await TypeParticipant.findOne({
      where: { id: typeId },
      attributes: ["name"],
    });
  }

  static async createParticipant(data) {
    return await Participant.create(data);
  }

  static async updateParticipant(participant, updatedData) {
    return await Participant.update(updatedData);
  }

  static async deleteParticipant(participant) {
    return await Participant.destroy({
      where: { id: participant.id },
    });
  }
}

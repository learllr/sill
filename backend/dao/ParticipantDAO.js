import db from "../orm/models/index.js";
const { Participant } = db;

export default class ParticipantDAO {
  static async getAllParticipants() {
    return await Participant.findAll();
  }

  static async getParticipantByIdAndType(id, type) {
    return await Participant.findOne({
      where: { id, type },
      attributes: [
        "id",
        "name",
        "type",
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

  static async updateParticipant(id, type, updatedData) {
    return await Participant.update(updatedData, {
      where: { id, type },
    });
  }

  static async deleteParticipant(participant) {
    return await participant.destroy();
  }
}

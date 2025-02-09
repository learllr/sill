import db from "../orm/models/index.js";
const { Participant, ContactPerson } = db;

export default class ParticipantDAO {
  static async getAllParticipants(type = null) {
    const whereCondition = type ? { type } : {};
    return await Participant.findAll({
      where: whereCondition,
      include: [{ model: ContactPerson, as: "contactPersons" }],
    });
  }

  static async getParticipantById(id) {
    return await Participant.findOne({
      where: { id },
      include: [{ model: ContactPerson, as: "contactPersons" }],
    });
  }

  static async createParticipant(data) {
    return await db.sequelize.transaction(async (transaction) => {
      const participant = await Participant.create(
        {
          type: data.type,
          name: data.name,
          address: data.address,
          website: data.website,
        },
        { transaction }
      );

      let contactPersons = [];

      if (
        Array.isArray(data.contactPersons) &&
        data.contactPersons.length > 0
      ) {
        contactPersons = await ContactPerson.bulkCreate(
          data.contactPersons.map((contact) => ({
            participantId: participant.id,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          })),
          { transaction }
        );
      }

      return { participant, contactPersons };
    });
  }

  static async updateParticipant(id, updatedData) {
    return await db.sequelize.transaction(async (transaction) => {
      const participant = await Participant.findByPk(id, {
        include: [{ model: ContactPerson, as: "contactPersons" }],
        transaction,
      });

      if (!participant) return null;

      await participant.update(
        {
          type: updatedData.type,
          name: updatedData.name,
          address: updatedData.address,
          website: updatedData.website,
        },
        { transaction }
      );

      if (Array.isArray(updatedData.contactPersons)) {
        const existingContacts = await ContactPerson.findAll({
          where: { participantId: id },
          transaction,
        });

        const existingContactIds = existingContacts.map((c) => c.id);
        const updatedContactIds = updatedData.contactPersons
          .filter((contact) => contact.id)
          .map((contact) => contact.id);

        const contactsToDelete = existingContactIds.filter(
          (id) => !updatedContactIds.includes(id)
        );

        if (contactsToDelete.length > 0) {
          await ContactPerson.destroy({
            where: { id: contactsToDelete },
            transaction,
          });
        }

        for (const contact of updatedData.contactPersons) {
          if (contact.id) {
            await ContactPerson.update(
              {
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
              },
              { where: { id: contact.id }, transaction }
            );
          } else {
            await ContactPerson.create(
              {
                participantId: id,
                name: contact.name,
                phone: contact.phone,
                email: contact.email,
              },
              { transaction }
            );
          }
        }
      }

      return await Participant.findByPk(id, {
        include: [{ model: ContactPerson, as: "contactPersons" }],
        transaction,
      });
    });
  }

  static async deleteParticipant(participant) {
    return await participant.destroy();
  }
}

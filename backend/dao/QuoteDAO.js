import db from "../orm/models/index.js";
const { Quote, Project, Participant } = db;

export default class QuoteDAO {
  static async getAllQuotes() {
    return await Quote.findAll({
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
      ],
      attributes: [
        "id",
        "title",
        "quoteNumber",
        "status",
        "sentOn",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  static async getQuoteById(id) {
    return await Quote.findOne({
      where: { id },
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
        {
          model: Participant,
          as: "participant",
          attributes: ["name"],
        },
      ],
    });
  }

  static async getQuotesByProjectAndParticipant(projectId, participantId) {
    console.log(projectId, participantId);
    return await Quote.findAll({
      where: {
        participantId,
        projectId,
      },
      attributes: [
        "id",
        "title",
        "imagePath",
        "lot",
        "status",
        "quoteNumber",
        "sentOn",
        "remarks",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  static async createQuote(quoteData) {
    return await Quote.create(quoteData);
  }

  static async updateQuote(quote, updatedData) {
    return await Quote.update(updatedData, {
      where: { id: quote.id },
    });
  }

  static async deleteQuote(quote) {
    return await Quote.destroy({
      where: { id: quote.id },
    });
  }
}

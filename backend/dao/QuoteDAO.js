import db from "../orm/models/index.js";
const { Quote, Project } = db;

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

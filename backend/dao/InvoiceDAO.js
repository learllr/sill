import db from "../orm/models/index.js";

const { Invoice, Participant, Project } = db;

export default class InvoiceDAO {
  static async getAllInvoices() {
    return await Invoice.findAll({
      include: [
        {
          model: Participant,
          as: "participant",
          attributes: ["id", "name"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "title",
        "invoiceNumber",
        "lot",
        "paidOn",
        "remarks",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  static async getInvoiceById(id) {
    return await Invoice.findOne({
      where: { id },
      include: [
        {
          model: Participant,
          as: "participant",
          attributes: ["name"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
      ],
    });
  }

  static async createInvoice(invoiceData) {
    return await Invoice.create(invoiceData);
  }

  static async updateInvoice(invoice, updatedData) {
    return await Invoice.update(updatedData, {
      where: { id: invoice.id },
    });
  }

  static async deleteInvoice(invoice) {
    return await Invoice.destroy({
      where: { id: invoice.id },
    });
  }
}

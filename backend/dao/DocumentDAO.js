import db from "../orm/models/index.js";
const { Document, TypeDocument, Project } = db;

export default class DocumentDAO {
  static async getAllDocuments() {
    return await Document.findAll({
      include: [
        {
          model: TypeDocument,
          as: "type",
          attributes: ["type"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
      ],
      attributes: ["id", "title", "imagePath", "createdAt", "updatedAt"],
    });
  }

  static async getDocumentById(id) {
    return await Document.findOne({
      where: { id },
      include: [
        {
          model: TypeDocument,
          as: "type",
          attributes: ["type"],
        },
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
      ],
    });
  }

  static async createDocument(documentData) {
    return await Document.create(documentData);
  }

  static async updateDocument(document, updatedData) {
    return await document.update(updatedData);
  }

  static async deleteDocument(document) {
    return await document.destroy();
  }
}

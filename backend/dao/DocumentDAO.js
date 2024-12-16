import fs from "fs";
import path from "path";
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

  static async getDocumentByType(typeId) {
    return await Document.findOne({
      where: { typeId },
      attributes: ["id", "title", "imagePath", "typeId", "createdAt"],
    });
  }

  static async createDocument(documentData) {
    return await Document.create(documentData);
  }

  static async updateDocument(document, updatedData) {
    return await Document.update(updatedData);
  }

  static async deleteDocument(document) {
    return await Document.destroy();
  }

  static async deleteDocumentsByTypeId(typeId) {
    const documents = await Document.findAll({
      where: { typeId },
      attributes: ["imagePath"],
    });

    for (const doc of documents) {
      if (doc.imagePath) {
        const filePath = path.resolve("uploads", doc.imagePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    return await Document.destroy({
      where: { typeId },
    });
  }
}

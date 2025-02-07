import fs from "fs";
import path from "path";
import db from "../orm/models/index.js";

const { Document, Project } = db;

export default class DocumentDAO {
  static async getAllDocuments() {
    return await Document.findAll({
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["name"],
        },
      ],
    });
  }

  static async getDocumentById(id) {
    return await Document.findOne({
      where: { id },
      include: [
        {
          model: Project,
          as: "project",
        },
      ],
    });
  }

  static async getDocumentsByType(typeName) {
    return await Document.findAll({
      where: { type: typeName },
    });
  }

  static async createDocument(documentData) {
    return await Document.create(documentData);
  }

  static async updateDocument(document, updatedData) {
    if (updatedData.path && document.path) {
      const oldFilePath = path.resolve("uploads", document.path);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return await document.update(updatedData);
  }

  static async deleteDocument(document) {
    if (document.path) {
      const filePath = path.resolve("uploads", document.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return await Document.destroy({
      where: { id: document.id },
    });
  }
}

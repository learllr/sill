import fs from "fs";
import path from "path";
import { DocumentType } from "../../shared/constants/types.js";
import db from "../orm/models/index.js";

const { Document, Project, InvoiceInfos, QuoteInfos, Sending } = db;

export default class DocumentDAO {
  static async getAllDocuments() {
    return await Document.findAll({
      include: [
        {
          model: Project,
          as: "project",
        },
        {
          model: InvoiceInfos,
          as: "invoiceInfos",
        },
        {
          model: QuoteInfos,
          as: "quoteInfos",
        },
      ],
    });
  }

  static async getDocumentById(id) {
    return await Document.findOne({
      where: { id },
      include: [
        {
          model: InvoiceInfos,
          as: "invoiceInfos",
        },
        {
          model: QuoteInfos,
          as: "quoteInfos",
        },
      ],
    });
  }

  static async createDocument(documentData) {
    return await db.sequelize.transaction(async (transaction) => {
      const document = await Document.create(
        {
          ...documentData,
          pvType: documentData.type === "PV" ? documentData.pvType : null,
        },
        { transaction }
      );

      if (
        documentData.type === DocumentType.FACTURES &&
        (documentData.invoiceNumber ||
          documentData.lot ||
          documentData.paidOn ||
          documentData.paymentMethod ||
          documentData.RG ||
          documentData.prorata ||
          documentData.finalCompletion)
      ) {
        await InvoiceInfos.create(
          {
            documentId: document.id,
            invoiceNumber: documentData.invoiceNumber || null,
            lot: documentData.lot || null,
            paidOn: documentData.paidOn || null,
            paymentMethod: documentData.paymentMethod || null,
            RG: documentData.RG || null,
            prorata: documentData.prorata || null,
            finalCompletion: documentData.finalCompletion || null,
          },
          { transaction }
        );
      }

      if (
        documentData.type === DocumentType.DEVIS &&
        (documentData.quoteNumber ||
          documentData.lot ||
          documentData.sentOn ||
          documentData.status)
      ) {
        await QuoteInfos.create(
          {
            documentId: document.id,
            quoteNumber: documentData.quoteNumber || null,
            lot: documentData.lot || null,
            sentOn: documentData.sentOn || null,
            status: documentData.status || "En attente",
          },
          { transaction }
        );
      }

      return document;
    });
  }

  static async updateDocument(document, updatedData) {
    if (updatedData.path && document.path) {
      const oldFilePath = path.resolve("uploads", document.path);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    return await db.sequelize.transaction(async (transaction) => {
      const updatedDocument = await document.update(
        {
          ...updatedData,
          pvType: updatedData.type === "PV" ? updatedData.pvType : null,
        },
        { transaction }
      );

      if (updatedData.type === DocumentType.FACTURES) {
        const existingInvoice = await InvoiceInfos.findOne({
          where: { documentId: document.id },
          transaction,
        });

        const isInvoiceEmpty =
          !updatedData.invoiceNumber &&
          !updatedData.lot &&
          !updatedData.paidOn &&
          !updatedData.paymentMethod;

        if (existingInvoice) {
          if (isInvoiceEmpty) {
            await existingInvoice.destroy({ transaction });
          } else {
            await existingInvoice.update(
              {
                invoiceNumber: updatedData.invoiceNumber,
                lot: updatedData.lot,
                paidOn: updatedData.paidOn,
                paymentMethod: updatedData.paymentMethod,
              },
              { transaction }
            );
          }
        } else if (!isInvoiceEmpty) {
          await InvoiceInfos.create(
            {
              documentId: document.id,
              invoiceNumber: updatedData.invoiceNumber,
              lot: updatedData.lot,
              paidOn: updatedData.paidOn,
              paymentMethod: updatedData.paymentMethod,
            },
            { transaction }
          );
        }
      }

      if (updatedData.type === DocumentType.DEVIS) {
        const existingQuote = await QuoteInfos.findOne({
          where: { documentId: document.id },
          transaction,
        });

        const isQuoteEmpty =
          !updatedData.quoteNumber &&
          !updatedData.lot &&
          !updatedData.sentOn &&
          !updatedData.status;

        if (existingQuote) {
          if (isQuoteEmpty) {
            await existingQuote.destroy({ transaction });
          } else {
            await existingQuote.update(
              {
                quoteNumber: updatedData.quoteNumber,
                lot: updatedData.lot,
                sentOn: updatedData.sentOn,
                status: updatedData.status,
              },
              { transaction }
            );
          }
        } else if (!isQuoteEmpty) {
          await QuoteInfos.create(
            {
              documentId: document.id,
              quoteNumber: updatedData.quoteNumber,
              lot: updatedData.lot,
              sentOn: updatedData.sentOn,
              status: updatedData.status,
            },
            { transaction }
          );
        }
      }

      return updatedDocument;
    });
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

  static async getAllSendings() {
    return await Sending.findAll({
      order: [["createdAt", "DESC"]],
    });
  }

  static async createSending({
    name,
    projectId,
    type,
    date,
    documentIds,
    remarks,
  }) {
    return await Sending.create({
      name,
      type,
      projectId,
      date,
      documentIds: JSON.stringify(documentIds),
      remarks,
    });
  }

  static async getSendingById(id) {
    return await Sending.findOne({ where: { id } });
  }

  static async updateSending(sending, updatedData) {
    return await sending.update(updatedData);
  }

  static async deleteSending(sendingId) {
    return await Sending.destroy({
      where: { id: sendingId },
    });
  }
}

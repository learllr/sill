import fs from "fs";
import path from "path";
import { DocumentType } from "../../shared/constants/types.js";
import db from "../orm/models/index.js";

const { Document, Project, InvoiceInfos, QuoteInfos } = db;

export default class DocumentDAO {
  static async getAllDocuments() {
    return await Document.findAll({
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["name"],
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

  static async getDocumentsByType(typeName) {
    return await Document.findAll({
      where: { type: typeName },
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
          documentData.finalCompletion ||
          documentData.remarks)
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
            remarks: documentData.remarks || null,
          },
          { transaction }
        );
      }

      if (
        documentData.type === DocumentType.DEVIS &&
        (documentData.quoteNumber ||
          documentData.lot ||
          documentData.sentOn ||
          documentData.remarks ||
          documentData.status)
      ) {
        await QuoteInfos.create(
          {
            documentId: document.id,
            quoteNumber: documentData.quoteNumber || null,
            lot: documentData.lot || null,
            sentOn: documentData.sentOn || null,
            remarks: documentData.remarks || null,
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
          !updatedData.paymentMethod &&
          !updatedData.remarks;

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
                remarks: updatedData.remarks,
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
              remarks: updatedData.remarks,
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
          !updatedData.remarks &&
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
                remarks: updatedData.remarks,
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
              remarks: updatedData.remarks,
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
}

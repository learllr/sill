import { sanitizeNullValues } from "../../shared/utils/databaseUtils.js";
import DocumentDAO from "../dao/DocumentDAO.js";

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await DocumentDAO.getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des documents" });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await DocumentDAO.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ error: "Document non trouvé" });
    }
    res.status(200).json(document);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du document" });
  }
};

export const createDocument = async (req, res) => {
  try {
    let documentData = sanitizeNullValues({ ...req.body });

    if (documentData.documentIds) {
      const documentIds = JSON.parse(documentData.documentIds);

      const sending = await DocumentDAO.createSending({
        projectId: documentData.projectId,
        date: documentData.date,
        documentIds,
      });

      return res.status(201).json({
        message: "Envoi créé avec succès",
        sending,
      });
    }

    if (req.file) {
      documentData.path = req.file.filename;
    }

    const document = await DocumentDAO.createDocument(documentData);

    res.status(201).json({ message: "Document ajouté avec succès", document });
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du document" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = sanitizeNullValues({ ...req.body });

    if (req.file) {
      updatedData.path = req.file.filename;
    }

    const document = await DocumentDAO.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    const updatedDocument = await DocumentDAO.updateDocument(
      document,
      updatedData
    );

    res.status(200).json({
      message: "Document mis à jour avec succès",
      updatedDocument,
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du document" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await DocumentDAO.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    await DocumentDAO.deleteDocument(document);

    res.status(200).json({ message: "Document supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du document" });
  }
};

export const getAllSendings = async (req, res) => {
  try {
    const sendings = await DocumentDAO.getAllSendings();
    res.status(200).json(sendings);
  } catch (error) {
    console.error("Erreur lors de la récupération des envois :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des envois" });
  }
};

export const deleteSending = async (req, res) => {
  try {
    const { id } = req.params;

    await DocumentDAO.deleteSending(id);
    res.status(200).json({ message: "Envoi supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'envoi :", error);
    res.status(500).json({ error: "Erreur lors de la suppression de l'envoi" });
  }
};

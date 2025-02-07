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

export const getDocumentsByTypeName = async (req, res) => {
  try {
    const { typeName } = req.params;
    const decodedTypeName = decodeURIComponent(typeName);
    const documents = await DocumentDAO.getDocumentsByType(decodedTypeName);

    if (!documents.length) {
      return res
        .status(200)
        .json({ message: "Aucun document trouvé", documents: [] });
    }

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Erreur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des documents" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const documentData = { ...req.body };

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
    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.path = req.file.filename;
    }

    updatedData = sanitizeNullValues(updatedData);

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

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

export const getDocumentsByTypeId = async (req, res) => {
  try {
    const { typeId } = req.params;
    const documents = await DocumentDAO.getDocumentsByType(typeId);

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        message: "Aucun document trouvé pour ce type",
        documents: [],
      });
    }

    res.status(200).json({ documents });
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des documents" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title, typeId, projectId: projectIdFromBody } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = req.file.filename;
    }

    if ([16, 17].includes(Number(typeId))) {
      await DocumentDAO.deleteDocumentsByTypeId(typeId);
    }

    const projectId = [16, 17].includes(Number(typeId))
      ? null
      : projectIdFromBody;

    const document = await DocumentDAO.createDocument({
      title,
      typeId,
      projectId,
      imagePath,
    });

    res.status(201).json({
      message: `Document de type ${typeId} créé avec succès`,
      document,
    });
  } catch (error) {
    console.error("Erreur lors de la création du document :", error);
    res.status(500).json({ error: "Erreur lors de la création du document" });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const document = await DocumentDAO.getDocumentById(id);

    if (!document) {
      return res.status(404).json({ error: "Document non trouvé" });
    }

    const updatedDocument = await DocumentDAO.updateDocument(
      document,
      updatedData
    );

    res
      .status(200)
      .json({ message: "Document mis à jour avec succès", updatedDocument });
  } catch (error) {
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

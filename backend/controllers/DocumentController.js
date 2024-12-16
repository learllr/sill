import DocumentDAO from "../dao/DocumentDAO.js";

export const getAllDocuments = async (req, res) => {
  try {
    const documents = await DocumentDAO.getAllDocuments();
    res.status(200).json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
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
    console.error("Erreur lors de la récupération du document :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du document" });
  }
};

export const createDocument = async (req, res) => {
  try {
    const { title, typeId, projectId, imagePath } = req.body;

    const document = await DocumentDAO.createDocument({
      title,
      typeId,
      projectId,
      imagePath,
    });

    res.status(201).json({ message: "Document créé avec succès", document });
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
    console.error("Erreur lors de la mise à jour du document :", error);
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
    console.error("Erreur lors de la suppression du document :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du document" });
  }
};

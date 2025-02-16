import SignatureStampDAO from "../dao/SignatureStampDAO.js";

export const uploadSignatureStamp = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu." });
    }

    const signatureStamp = await SignatureStampDAO.createOrUpdateSignature(
      req.file.filename
    );

    res.status(200).json({
      message: "Tampon enregistré avec succès",
      filePath: signatureStamp.filePath,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload du tampon :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getSignatureStamp = async (req, res) => {
  try {
    const signatureStamp = await SignatureStampDAO.getSignatureStamp();
    if (!signatureStamp) {
      return res.status(404).json({ message: "Aucun tampon trouvé." });
    }

    res.status(200).json({ filePath: signatureStamp.filePath });
  } catch (error) {
    console.error("Erreur lors de la récupération du tampon :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

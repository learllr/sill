import ParticipantDAO from "../dao/ParticipantDAO.js";

export const getAllParticipants = async (req, res) => {
  try {
    const { typeId } = req.params;
    const participants = await ParticipantDAO.getAllParticipantsByType(typeId);
    res.status(200).json(participants);
  } catch (error) {
    console.error("Erreur lors de la récupération des participants :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des participants" });
  }
};

export const getParticipantById = async (req, res) => {
  try {
    const { id, typeId } = req.params;
    const participant = await ParticipantDAO.getParticipantByIdAndType(
      id,
      typeId
    );
    if (!participant) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }
    res.status(200).json(participant);
  } catch (error) {
    console.error("Erreur lors de la récupération du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du participant" });
  }
};

export const createParticipant = async (req, res) => {
  try {
    const { typeId, name, contactPerson, phone, email, address, website } =
      req.body;

    if (!typeId) {
      return res.status(400).json({ error: "typeId est requis" });
    }

    const participant = await ParticipantDAO.createParticipant({
      typeId,
      name,
      contactPerson,
      phone,
      email,
      address,
      website,
    });

    res
      .status(201)
      .json({ message: "Participant créé avec succès", participant });
  } catch (error) {
    console.error("Erreur lors de la création du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création du participant" });
  }
};

export const updateParticipant = async (req, res) => {
  try {
    const { id, typeId } = req.params;
    const { name, contactPerson, phone, email, address, website } = req.body;

    const participant = await ParticipantDAO.getParticipantByIdAndType(
      id,
      typeId
    );
    if (!participant) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }

    const updatedParticipant = await ParticipantDAO.updateParticipant(
      participant,
      {
        name,
        contactPerson,
        phone,
        email,
        address,
        website,
      }
    );

    res.status(200).json({
      message: "Participant mis à jour avec succès",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du participant" });
  }
};

export const deleteParticipantById = async (req, res) => {
  try {
    const { id, typeId } = req.params;

    const participant = await ParticipantDAO.getParticipantByIdAndType(
      id,
      typeId
    );
    if (!participant) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }

    await ParticipantDAO.deleteParticipant(participant);
    res.status(200).json({ message: "Participant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du participant" });
  }
};

import { sanitizeNullValues } from "../../shared/utils/databaseUtils.js";
import ParticipantDAO from "../dao/ParticipantDAO.js";

export const getAllParticipants = async (req, res) => {
  try {
    const { type } = req.params;
    const participants = await ParticipantDAO.getAllParticipants(type);
    res.status(200).json(participants);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des participants" });
  }
};

export const getParticipantById = async (req, res) => {
  try {
    const { id } = req.params;
    const participant = await ParticipantDAO.getParticipantById(id);
    if (!participant)
      return res.status(404).json({ error: "Participant non trouvé" });
    res.status(200).json(participant);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération du participant" });
  }
};

export const createParticipant = async (req, res) => {
  try {
    console.log(req.body);
    const participantData = sanitizeNullValues(req.body);
    await ParticipantDAO.createParticipant(participantData);

    res.status(201).json({
      message: "Participant créé avec succès",
    });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création du participant" });
  }
};

export const updateParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = sanitizeNullValues(req.body);

    const updatedParticipant = await ParticipantDAO.updateParticipant(
      id,
      updatedData
    );
    if (!updatedParticipant) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }

    res.status(200).json({
      message: "Participant mis à jour avec succès",
      participant: updatedParticipant,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Erreur lors de la mise à jour du participant",
    });
  }
};

export const deleteParticipantById = async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await ParticipantDAO.getParticipantById(id);
    if (!participant) {
      return res.status(404).json({ error: "Participant non trouvé" });
    }

    await ParticipantDAO.deleteParticipant(participant);
    res.status(200).json({ message: "Participant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur serveur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du participant" });
  }
};

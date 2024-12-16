import ProjectDAO from "../dao/ProjectDAO.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await ProjectDAO.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des projets" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectDAO.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Erreur lors de la récupération du projet :", error);
    res.status(500).json({ error: "Erreur lors de la récupération du projet" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, billingClientId } = req.body;

    const project = await ProjectDAO.createProject({
      name,
      billingClientId,
    });

    res.status(201).json({ message: "Projet créé avec succès", project });
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    res.status(500).json({ error: "Erreur lors de la création du projet" });
  }
};

export const assignParticipantToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId, type } = req.body;

    await ProjectDAO.addParticipantToProject(id, participantId, type);

    res
      .status(201)
      .json({ message: "Participant associé au projet avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'association d'un participant :", error);
    res.status(500).json({
      error: "Erreur lors de l'association du participant au projet",
    });
  }
};

export const updateParticipantsForProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantIds, type } = req.body;

    await ProjectDAO.updateParticipantsForProject(id, participantIds, type);

    res.status(200).json({ message: "Participants mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des participants :", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour des participants",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await ProjectDAO.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    await ProjectDAO.deleteProject(project);

    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du projet :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du projet" });
  }
};

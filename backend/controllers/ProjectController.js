import ProjectDAO from "../dao/ProjectDAO.js";

export const getAllProjects = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = status ? { status } : {};
    const projects = await ProjectDAO.getAllProjects(whereClause);
    res.status(200).json(projects);
  } catch (error) {
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
    const project = await ProjectDAO.createProject(req.body);

    res.status(201).json({ message: "Projet créé avec succès", project });
  } catch (error) {
    console.error("Erreur lors de la création du projet :", error);
    res.status(500).json({ error: "Erreur lors de la création du projet" });
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

export const assignParticipantToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { participantId, type } = req.body;

    await ProjectDAO.addParticipantToProject(id, participantId, type);

    res
      .status(201)
      .json({ message: "Participant ajouté au projet avec succès" });
  } catch (error) {
    console.error("Erreur lors de l'ajout du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de l'ajout du participant au projet" });
  }
};

export const removeParticipantFromProject = async (req, res) => {
  try {
    const { id, participantId } = req.params;

    await ProjectDAO.removeParticipantFromProject(id, participantId);

    res.status(200).json({ message: "Participant supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du participant :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du participant" });
  }
};

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

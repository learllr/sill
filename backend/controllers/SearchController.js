import EmployeeDAO from "../dao/EmployeeDAO.js";
import ParticipantDAO from "../dao/ParticipantDAO.js";
import ProjectDAO from "../dao/ProjectDAO.js";

export const getAllData = async (req, res) => {
  try {
    const [
      projects,
      employees,
      clients,
      fournisseurs,
      sousTraitants,
      architectes,
    ] = await Promise.all([
      ProjectDAO.getAllProjects({}, false),
      EmployeeDAO.getAllEmployees({}, false),
      ParticipantDAO.getAllParticipantsByType(1),
      ParticipantDAO.getAllParticipantsByType(2),
      ParticipantDAO.getAllParticipantsByType(3),
      ParticipantDAO.getAllParticipantsByType(4),
    ]);

    const results = [
      ...projects.map((project) => ({
        id: project.id,
        name: project.name,
        type: "chantier",
      })),
      ...employees.map((employee) => ({
        id: employee.id,
        name: employee.firstName + " " + employee.lastName,
        type: "salarié",
      })),
      ...clients.map((client) => ({
        id: client.id,
        name: client.name,
        type: "client",
      })),
      ...fournisseurs.map((fournisseur) => ({
        id: fournisseur.id,
        name: fournisseur.name,
        type: "fournisseur",
      })),
      ...sousTraitants.map((sousTraitant) => ({
        id: sousTraitant.id,
        name: sousTraitant.name,
        type: "sous-traitant",
      })),
      ...architectes.map((architecte) => ({
        id: architecte.id,
        name: architecte.name,
        type: "architecte",
      })),
    ];

    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données." });
  }
};
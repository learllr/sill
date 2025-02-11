import db from "../orm/models/index.js";
const { Project, Participant, ProjectParticipant } = db;

export default class ProjectDAO {
  static async getAllProjects({ status, participantType }) {
    const whereClause = status && status !== "Tous" ? { status } : {};

    let includeParticipants = [];

    if (participantType) {
      const participantAlias = {
        Client: "clients",
        Fournisseur: "suppliers",
        "Sous-traitant": "subcontractors",
        Architecte: "architects",
      }[participantType];

      if (participantAlias) {
        includeParticipants.push({
          model: Participant,
          as: participantAlias,
          required: true,
        });
      }
    } else {
      includeParticipants = [
        { model: Participant, as: "clients" },
        { model: Participant, as: "suppliers" },
        { model: Participant, as: "subcontractors" },
        { model: Participant, as: "architects" },
      ];
    }

    return await Project.findAll({
      where: whereClause,
      include: includeParticipants,
    });
  }

  static async getProjectById(id) {
    return await Project.findOne({
      where: { id },
    });
  }

  static async createProject(projectData) {
    return await Project.create(projectData);
  }

  static async updateProject(project, updatedData) {
    return await project.update(updatedData);
  }

  static async deleteProject(project) {
    return await project.destroy();
  }

  static async addParticipantToProject(projectId, participantId, type) {
    return await ProjectParticipant.create({
      projectId,
      participantId,
      type,
    });
  }

  static async removeParticipantFromProject(projectId, participantId) {
    return await ProjectParticipant.destroy({
      where: {
        projectId,
        participantId,
      },
    });
  }
}

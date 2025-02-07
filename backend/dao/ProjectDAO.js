import db from "../orm/models/index.js";
const { Project, Participant, ProjectParticipant } = db;

export default class ProjectDAO {
  static async getAllProjects() {
    return await Project.findAll();
  }

  static async getProjectById(id) {
    return await Project.findOne({
      where: { id },
      include: [
        {
          model: Participant,
          as: "clients",
          attributes: ["id", "name", "contactPerson", "email"],
        },
        {
          model: Participant,
          as: "suppliers",
          attributes: ["id", "name", "contactPerson", "email"],
        },
        {
          model: Participant,
          as: "subcontractors",
          attributes: ["id", "name", "contactPerson", "email"],
        },
        {
          model: Participant,
          as: "architects",
          attributes: ["id", "name", "contactPerson", "email"],
        },
      ],
      attributes: ["id", "name"],
    });
  }

  static async createProject(projectData) {
    return await Project.create(projectData);
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

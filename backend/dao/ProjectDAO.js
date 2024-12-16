import db from "../orm/models/index.js";
const { Project, Client, ProjectParticipant, Participant } = db;

export default class ProjectDAO {
  static async getAllProjects() {
    return await Project.findAll({
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["name", "contactPerson", "email"],
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
      attributes: ["id", "name", "createdAt"],
    });
  }

  static async getProjectById(id) {
    return await Project.findOne({
      where: { id },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["name", "contactPerson"],
        },
      ],
      attributes: ["id", "name", "createdAt"],
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

  static async updateParticipantsForProject(projectId, participantIds, type) {
    await ProjectParticipant.destroy({
      where: { projectId, type },
    });

    const participants = participantIds.map((participantId) => ({
      projectId,
      participantId,
      type,
    }));

    return await ProjectParticipant.bulkCreate(participants);
  }

  static async deleteProject(projectId) {
    return await Project.destroy({ where: { id: projectId } });
  }
}

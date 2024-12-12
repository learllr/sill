import db from "../orm/models/index.js";
const { Project, Client } = db;

export default class ProjectDAO {
  static async getAllProjects() {
    return await Project.findAll({
      include: [
        {
          model: Client,
          as: "billingClient",
          attributes: ["name"],
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
          as: "billingClient",
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
}

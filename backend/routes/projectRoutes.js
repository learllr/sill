import express from "express";
import {
  assignParticipantToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getParticipantsByProject,
  getProjectById,
  removeParticipantFromProject,
  updateProject,
} from "../controllers/ProjectController.js";

const router = express.Router();

router.get("/", getAllProjects);

router.get("/:id", getProjectById);
router.post("/", createProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/participants", assignParticipantToProject);
router.delete("/:id/participants/:participantId", removeParticipantFromProject);
router.get("/:id/participants", getParticipantsByProject);

export default router;

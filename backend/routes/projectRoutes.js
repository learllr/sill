import express from "express";
import {
  assignParticipantToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  removeParticipantFromProject,
} from "../controllers/ProjectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.post("/:id/participants", assignParticipantToProject);
router.delete("/:id/participants/:participantId", removeParticipantFromProject);

export default router;

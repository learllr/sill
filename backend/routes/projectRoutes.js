import express from "express";
import {
  assignParticipantToProject,
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateParticipantsForProject,
} from "../controllers/ProjectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProject);
router.post("/:id/participants", assignParticipantToProject);
router.put("/:id/participants", updateParticipantsForProject);

export default router;

import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
} from "../controllers/ProjectController.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", createProject);

export default router;

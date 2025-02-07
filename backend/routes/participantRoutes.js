import express from "express";
import {
  createParticipant,
  deleteParticipantById,
  getAllParticipants,
  getParticipantById,
  updateParticipant,
} from "../controllers/ParticipantController.js";

const router = express.Router();

router.get("/", getAllParticipants);
router.get("/:type/:id", getParticipantById);
router.post("/", createParticipant);
router.put("/:type/:id", updateParticipant);
router.delete("/:type/:id", deleteParticipantById);

export default router;

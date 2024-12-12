import express from "express";
import {
  getAllParticipants,
  getParticipantById,
  createParticipant,
  updateParticipant,
  deleteParticipantById,
} from "../controllers/ParticipantController.js";

const router = express.Router();

router.get("/:typeId", getAllParticipants);
router.get("/:typeId/:id", getParticipantById);
router.post("/", createParticipant);
router.put("/:typeId/:id", updateParticipant);
router.delete("/:typeId/:id", deleteParticipantById);

export default router;

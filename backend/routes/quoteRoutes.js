import express from "express";
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getQuoteById,
  getQuotesByProjectAndParticipant,
  updateQuote,
} from "../controllers/QuoteController.js";

const router = express.Router();

router.get("/", getAllQuotes);
router.get("/:id", getQuoteById);
router.get("/:participantId/:projectId", getQuotesByProjectAndParticipant);
router.post("/", createQuote);
router.put("/:id", updateQuote);
router.delete("/:id", deleteQuote);

export default router;

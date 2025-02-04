import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  getInvoicesByProjectAndParticipant,
} from "../controllers/InvoiceController.js";

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.get("/:projectId/:participantId", getInvoicesByProjectAndParticipant);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;

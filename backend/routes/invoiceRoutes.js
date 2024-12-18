import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
} from "../controllers/InvoiceController.js";

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.post("/", createInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;

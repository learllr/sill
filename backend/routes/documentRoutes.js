import express from "express";
import {
  createDocument,
  createSending,
  deleteDocument,
  deleteSending,
  getAllDocuments,
  getAllSendings,
  getDocumentById,
  updateDocument,
  updateSending,
} from "../controllers/DocumentController.js";
import { upload } from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.get("/sendings", getAllSendings);
router.get("/:id", getDocumentById);
router.post("/", upload.single("file"), createDocument);
router.put("/:id", upload.single("file"), updateDocument);
router.delete("/:id", deleteDocument);
router.post("/sendings", upload.none(), createSending);
router.put("/sendings/:id", upload.none(), updateSending);
router.delete("/sendings/:id", deleteSending);

export default router;

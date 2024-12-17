import express from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsByTypeId,
  updateDocument,
} from "../controllers/DocumentController.js";
import { upload } from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.get("/type/:typeId", getDocumentsByTypeId);
router.post("/", upload.single("file"), createDocument);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;

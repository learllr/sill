import express from "express";
import {
  createDocument,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsByTypeName,
  updateDocument,
} from "../controllers/DocumentController.js";
import { upload } from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.get("/type/:typeName", getDocumentsByTypeName);
router.post("/", upload.single("file"), createDocument);
router.put("/:id", upload.single("file"), updateDocument);
router.delete("/:id", deleteDocument);

export default router;

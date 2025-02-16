import express from "express";
import {
  getSignatureStamp,
  uploadSignatureStamp,
} from "../controllers/SignatureStampController.js";
import { upload } from "../middlewares/multerConfig.js";

const router = express.Router();

router.get("/", getSignatureStamp);
router.post("/", upload.single("file"), uploadSignatureStamp);

export default router;

import express from "express";
import {
  deleteLoginHistory,
  getLoginHistory,
  login,
  logout,
} from "../controllers/AuthentificationController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/history", getLoginHistory);
router.delete("/history", deleteLoginHistory);

export default router;

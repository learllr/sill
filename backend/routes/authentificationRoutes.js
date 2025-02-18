import express from "express";
import {
  deleteLoginHistory,
  getLoginHistory,
  login,
  logout,
  signup,
} from "../controllers/AuthentificationController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/history", getLoginHistory);
router.delete("/history", deleteLoginHistory);

export default router;

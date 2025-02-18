import express from "express";
import {
  createUser,
  deleteUserById,
  getAllUsers,
  getProfile,
  updateUser,
} from "../controllers/UserController.js";
import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/UserSettingController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/:id", updateUser);
router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUserById);

router.get("/settings", getUserSettings);
router.put("/settings", updateUserSettings);

export default router;

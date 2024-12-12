import express from "express";
import {
  getProfile,
  updateUser,
  getAllUsers,
  deleteUserById,
  createUser,
} from "../controllers/UserController.js";
import {
  getUserSettings,
  updateUserSettings,
} from "../controllers/UserSettingController.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/update/:id", updateUser);
router.get("/all", getAllUsers);
router.post("/add", createUser);
router.delete("/delete/:id", deleteUserById);

router.get("/settings", getUserSettings);
router.put("/settings", updateUserSettings);

export default router;

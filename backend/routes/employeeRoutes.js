import express from "express";
import {
  deleteEmployeeById,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
} from "../controllers/EmployeeController.js";

const router = express.Router();

router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", updateEmployeeById);
router.delete("/:id", deleteEmployeeById);

export default router;

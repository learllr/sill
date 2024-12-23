import express from "express";
import { getAllData } from "../controllers/SearchController.js";

const router = express.Router();

router.get("/", getAllData);

export default router;

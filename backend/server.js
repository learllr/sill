import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { authenticateToken } from "./middlewares/authMiddleware.js";
import db from "./orm/models/index.js";
import authentificationRoutes from "./routes/authentificationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import signatureRoutes from "./routes/signatureStampRoutes.js";

const app = express();
const port = process.env.PORT || 5000;
const frontendUrl = "http://localhost:5173";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",

  express.static(path.resolve("uploads"), {
    setHeaders: (res) => {
      res.setHeader("Access-Control-Allow-Origin", frontendUrl);

      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    },
  })
);

const corsOptions = {
  origin: frontendUrl,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/authentification", authentificationRoutes);
app.use("/api/user", authenticateToken, userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/participant", participantRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/signature", signatureRoutes);

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

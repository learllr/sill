import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import AuthentificationDAO from "../dao/AuthentificationDAO.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AuthentificationDAO.findUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ error: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const { id, firstName, lastName, roleId } = user;

    await AuthentificationDAO.createLoginRecord(id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Connexion réussie",
      user: {
        id,
        email,
        firstName,
        lastName,
        roleId,
      },
      token,
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la connexion de l'utilisateur" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Déconnexion réussie" });
};

export const getLoginHistory = async (req, res) => {
  try {
    const history = await AuthentificationDAO.getAllLoginHistory();
    res.status(200).json(history);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'historique des connexions:",
      error
    );
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'historique" });
  }
};

export const deleteLoginHistory = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ error: "Aucun ID fourni pour suppression" });
    }

    await AuthentificationDAO.deleteLoginRecords(ids);
    res.status(200).json({ message: "Historique supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'historique:", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
};

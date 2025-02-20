import bcrypt from "bcrypt";
import UserDAO from "../dao/UserDAO.js";

export const getProfile = async (req, res) => {
  try {
    const user = await UserDAO.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du profil de l'utilisateur:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la récupération du profil de l'utilisateur.",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserDAO.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    const updatedData = { ...req.body };
    if (!updatedData.password) {
      delete updatedData.password;
    }

    const updatedUser = await UserDAO.updateUser(user, updatedData);

    res.status(200).json({
      message: "Informations de l'utilisateur mises à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour des informations de l'utilisateur:",
      error
    );
    res.status(500).json({
      error: "Erreur lors de la mise à jour des informations de l'utilisateur",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserDAO.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserDAO.createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId,
    });

    res.status(201).json({ message: "Utilisateur créé avec succès", user });
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserDAO.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    await UserDAO.deleteUser(user);
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'utilisateur" });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const roles = await UserDAO.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Erreur lors de la récupération des rôles:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des rôles." });
  }
};

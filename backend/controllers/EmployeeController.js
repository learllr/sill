import { sanitizeNullValues } from "../../shared/utils/databaseUtils.js";
import EmployeeDAO from "../dao/EmployeeDAO.js";

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeDAO.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des employés" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    let employeeData = { ...req.body };

    if (req.file) {
      employeeData.profilePicture = req.file.filename;
    }

    employeeData = sanitizeNullValues(employeeData);

    const employee = await EmployeeDAO.createEmployee(employeeData);

    res.status(201).json({ message: "Employé ajouté avec succès", employee });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'employé" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await EmployeeDAO.getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    res.status(200).json(employee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'employé" });
  }
};

export const updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = { ...req.body };

    if (req.file) {
      updatedData.profilePicture = req.file.filename;
    }

    // Nettoyage des valeurs nulles
    updatedData = sanitizeNullValues(updatedData);

    const employee = await EmployeeDAO.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    const updatedEmployee = await EmployeeDAO.updateEmployee(id, updatedData);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'employé" });
  }
};

export const deleteEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await EmployeeDAO.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    await EmployeeDAO.deleteEmployee(employee);
    res.status(200).json({ message: "Employé supprimé avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'employé" });
  }
};

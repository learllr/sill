import EmployeeDAO from "../dao/EmployeeDAO.js";

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await EmployeeDAO.getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Erreur lors de la récupération des employés :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des employés" });
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
    console.error("Erreur lors de la récupération de l'employé :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'employé" });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const employeeData = req.body;
    const newEmployee = await EmployeeDAO.createEmployee(employeeData);
    res
      .status(201)
      .json({ message: "Salarié créé avec succès", employee: newEmployee });
  } catch (error) {
    console.error("Erreur lors de la création du salarié :", error);
    res.status(500).json({ error: "Erreur lors de la création du salarié" });
  }
};

export const updateEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const employee = await EmployeeDAO.getEmployeeById(id);
    if (!employee) {
      return res.status(404).json({ error: "Employé non trouvé" });
    }

    const updatedEmployee = await EmployeeDAO.updateEmployee(id, updatedData);
    res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'employé :", error);
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
    console.error("Erreur lors de la suppression de l'employé :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'employé" });
  }
};

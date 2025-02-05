import InvoiceDAO from "../dao/InvoiceDAO.js";

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceDAO.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des factures" });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceDAO.getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la facture" });
  }
};

export const getInvoicesByProjectAndParticipant = async (req, res) => {
  try {
    const { projectId, participantId } = req.params;
    const invoices = await InvoiceDAO.getInvoicesByProjectAndParticipant(
      participantId,
      projectId
    );

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        error: "Aucune facture trouvée pour ce participant et ce projet",
      });
    }

    res.status(200).json(invoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des factures" });
  }
};

export const createInvoice = async (req, res) => {
  try {
    const invoiceData = req.body;
    const invoice = await InvoiceDAO.createInvoice(invoiceData);
    res.status(201).json({ message: "Facture créée avec succès", invoice });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création de la facture" });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const invoice = await InvoiceDAO.getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    const updatedInvoice = await InvoiceDAO.updateInvoice(invoice, updatedData);
    res
      .status(200)
      .json({ message: "Facture mise à jour avec succès", updatedInvoice });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la facture" });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await InvoiceDAO.getInvoiceById(id);
    if (!invoice) {
      return res.status(404).json({ error: "Facture non trouvée" });
    }
    await InvoiceDAO.deleteInvoice(invoice);
    res.status(200).json({ message: "Facture supprimée avec succès" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la facture" });
  }
};

import QuoteDAO from "../dao/QuoteDAO.js";

export const getAllQuotes = async (req, res) => {
  try {
    const quotes = await QuoteDAO.getAllQuotes();
    res.status(200).json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des devis" });
  }
};

export const getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await QuoteDAO.getQuoteById(id);
    if (!quote) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }
    res.status(200).json(quote);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du devis" });
  }
};

export const getQuotesByProjectAndParticipant = async (req, res) => {
  try {
    const { participantId, projectId } = req.params;

    const quotes = await QuoteDAO.getQuotesByProjectAndParticipant(
      projectId,
      participantId
    );

    if (!quotes || quotes.length === 0) {
      return res
        .status(404)
        .json({ error: "Aucun devis trouvé pour ce participant et ce projet" });
    }

    res.status(200).json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des devis" });
  }
};

export const createQuote = async (req, res) => {
  try {
    const quote = await QuoteDAO.createQuote(req.body);
    res.status(201).json({ message: "Devis créé avec succès", quote });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du devis" });
  }
};

export const updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const quote = await QuoteDAO.getQuoteById(id);
    if (!quote) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    const updatedQuote = await QuoteDAO.updateQuote(quote, updatedData);
    res
      .status(200)
      .json({ message: "Devis mis à jour avec succès", updatedQuote });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du devis" });
  }
};

export const deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const quote = await QuoteDAO.getQuoteById(id);
    if (!quote) {
      return res.status(404).json({ error: "Devis non trouvé" });
    }

    await QuoteDAO.deleteQuote(quote);
    res.status(200).json({ message: "Devis supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du devis" });
  }
};

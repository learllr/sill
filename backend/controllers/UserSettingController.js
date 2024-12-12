import UserSettingDAO from "../dao/UserSettingDAO.js";

export const getUserSettings = async (req, res) => {
  const userId = req.user.id;

  try {
    const userSettings = await UserSettingDAO.getUserSettingByUserId(userId);

    res.status(200).json(userSettings);
  } catch (error) {
    console.error("Erreur lors de la récupération des paramètres :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des paramètres" });
  }
};

export const updateUserSettings = async (req, res) => {
  const userId = req.user.id;
  const settings = req.body;

  try {
    const updatedSettings = await UserSettingDAO.update(
      userId,
      settings
    );

    if (!updatedSettings) {
      return res
        .status(404)
        .json({ message: "Paramètres non trouvés pour cet utilisateur" });
    }

    res
      .status(200)
      .json({ message: "Paramètres mis à jour avec succès", updatedSettings });
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres :", error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour des paramètres" });
  }
};

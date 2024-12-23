"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: "Rénovation Maison",
          status: "En cours",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Construction Villa",
          status: "Terminé",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aménagement Bureau",
          status: "Non commencé",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Projects", null, {});
  },
};

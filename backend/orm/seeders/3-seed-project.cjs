"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: "Rénovation Maison",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Construction Villa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aménagement Bureau",
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

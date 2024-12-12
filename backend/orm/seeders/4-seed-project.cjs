"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Projects",
      [
        {
          name: "Rénovation Maison",
          billingClientId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Construction Villa",
          billingClientId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aménagement Bureau",
          billingClientId: 1,
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

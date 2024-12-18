"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "TypeParticipants",
      [
        {
          name: "Client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fournisseur",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sous-traitant",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Architecte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TypeParticipants", null, {});
  },
};

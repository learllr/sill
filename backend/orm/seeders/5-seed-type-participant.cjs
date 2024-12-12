"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "TypeParticipants",
      [
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
          name: "Client",
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

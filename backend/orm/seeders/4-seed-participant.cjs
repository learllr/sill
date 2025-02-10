"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Participants",
      [
        {
          name: "Client A",
          type: "Client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Client B",
          type: "Client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fournisseur X",
          type: "Fournisseur",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Fournisseur Y",
          type: "Fournisseur",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sous-traitant Alpha",
          type: "Sous-traitant",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Sous-traitant Beta",
          type: "Sous-traitant",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Architecte Z",
          type: "Architecte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Architecte W",
          type: "Architecte",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Participants", null, {});
  },
};

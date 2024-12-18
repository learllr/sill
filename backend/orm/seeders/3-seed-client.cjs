"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Clients",
      [
        {
          name: "Entreprise Roullier",
          contactPerson: "Léa Roullier",
          address: "12 Rue de la Paix, Paris",
          phone: "0612345678",
          email: "lea.roullier@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Martins Design",
          contactPerson: "Sarah Martins",
          address: "45 Avenue des Champs, Lyon",
          phone: "0456789123",
          email: "sarah.martins@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Aménagement Durand",
          contactPerson: "Jean Durand",
          address: "78 Boulevard Haussmann, Marseille",
          phone: "0678912345",
          email: "jean.durand@example.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Clients", null, {});
  },
};

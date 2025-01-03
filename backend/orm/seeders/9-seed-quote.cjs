"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Quotes",
      [
        {
          title: "Devis 1",
          imagePath: null,
          participantId: 1,
          projectId: 1,
          lot: "Lot 1",
          status: "En attente",
          quoteNumber: "QUO-001",
          sentOn: "02/12/2023",
          remarks: "Aucune remarque",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Devis 2",
          imagePath: null,
          participantId: 2,
          projectId: 1,
          lot: "Lot 2",
          status: "Accepté",
          quoteNumber: "QUO-002",
          sentOn: "04/12/2023",
          remarks: "Accepté par le client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Devis 3",
          imagePath: null,
          participantId: 3,
          projectId: 2,
          lot: "Lot 3",
          status: "Rejeté",
          quoteNumber: "QUO-003",
          sentOn: "06/12/2023",
          remarks: "Rejeté par le client",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Devis 4",
          imagePath: null,
          participantId: 4,
          projectId: 2,
          lot: "Lot 4",
          status: "En attente",
          quoteNumber: "QUO-004",
          sentOn: "08/12/2023",
          remarks: "En attente de validation",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Quotes", null, {});
  },
};

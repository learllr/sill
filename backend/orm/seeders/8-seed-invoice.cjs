"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Invoices",
      [
        {
          title: "Facture 1",
          imagePath: null,
          participantId: 1,
          projectId: 1,
          lot: "Lot 1",
          invoiceNumber: "INV-001",
          paidOn: new Date(),
          remarks: "Aucune remarque",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Facture 2",
          imagePath: null,
          participantId: 2,
          projectId: 1,
          lot: "Lot 2",
          invoiceNumber: "INV-002",
          paidOn: null,
          remarks: "En attente de paiement",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Facture 3",
          imagePath: null,
          participantId: 3,
          projectId: 2,
          lot: "Lot 3",
          invoiceNumber: "INV-003",
          paidOn: new Date(),
          remarks: "Payée en totalité",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Facture 4",
          imagePath: null,
          participantId: 4,
          projectId: 2,
          lot: "Lot 4",
          invoiceNumber: "INV-004",
          paidOn: null,
          remarks: "En attente de validation",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Facture 5",
          imagePath: null,
          participantId: 5,
          projectId: 3,
          lot: "Lot 5",
          invoiceNumber: "SUB-001",
          paidOn: new Date(),
          remarks: "Facture réglée",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Facture 6",
          imagePath: null,
          participantId: 6,
          projectId: 3,
          lot: "Lot 6",
          invoiceNumber: "SUB-002",
          paidOn: null,
          remarks: "En attente de paiement",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Invoices", null, {});
  },
};

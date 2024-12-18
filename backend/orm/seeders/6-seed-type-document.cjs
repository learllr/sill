"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "TypeDocuments",
      [
        {
          type: "bon pour accord",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "fiche technique",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "bon de commande",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "bon de livraison",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "AR de commandes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "administratif",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "contrats",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "plan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "PV avec réserves",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "PV sans réserves",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "ordre de règlement",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "réserve",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "congé payé",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "courrier",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "note de service",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "banque",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "statut SILL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TypeDocuments", null, {});
  },
};

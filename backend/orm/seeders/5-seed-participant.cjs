"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Participants",
      [
        {
          typeId: 1,
          name: "Client Lambda",
          contactPerson: "Sophie Bernard",
          address: "5 Rue Victor Hugo, Toulouse",
          phone: "0756789012",
          email: "lambda@client.com",
          website: "https://lambda-client.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 1,
          name: "Client Epsilon",
          contactPerson: "François Perrin",
          address: "24 Rue des Écoles, Strasbourg",
          phone: "0987654321",
          email: "epsilon@client.com",
          website: "https://epsilon-client.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 2,
          name: "Fournisseur Alpha",
          contactPerson: "Jean Dupont",
          address: "12 Rue des Lilas, Paris",
          phone: "0123456789",
          email: "alpha@fournisseur.com",
          website: "https://alpha-fournisseur.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 2,
          name: "Fournisseur Beta",
          contactPerson: "Marie Dubois",
          address: "45 Avenue des Champs, Lyon",
          phone: "0456789123",
          email: "beta@fournisseur.com",
          website: "https://beta-fournisseur.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 3,
          name: "Sous-traitant Omega",
          contactPerson: "Paul Martin",
          address: "78 Boulevard Haussmann, Marseille",
          phone: "0678912345",
          email: "omega@sous-traitant.com",
          website: "https://omega-sous-traitant.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 3,
          name: "Sous-traitant Delta",
          contactPerson: "Alice Renault",
          address: "90 Quai de la Seine, Bordeaux",
          phone: "0567891234",
          email: "delta@sous-traitant.com",
          website: "https://delta-sous-traitant.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 4,
          name: "Architecte Gamma",
          contactPerson: "Claire Fournier",
          address: "10 Rue de la Paix, Lille",
          phone: "0212345678",
          email: "gamma@architecte.com",
          website: "https://gamma-architecte.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          typeId: 4,
          name: "Architecte Sigma",
          contactPerson: "Julien Lefevre",
          address: "34 Place de la République, Nantes",
          phone: "0712345678",
          email: "sigma@architecte.com",
          website: "https://sigma-architecte.com",
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

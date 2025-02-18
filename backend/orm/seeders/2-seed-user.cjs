"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword1 = await bcrypt.hash("TestTest4", 10);
    const hashedPassword2 = await bcrypt.hash("TestTest4", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Léa",
          lastName: "ROULLIER",
          email: "leleroullier@gmail.com",
          password: hashedPassword1,
          roleId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Sarah",
          lastName: "MARTINS",
          email: "sarah.martins@gmail.com",
          password: hashedPassword2,
          roleId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};

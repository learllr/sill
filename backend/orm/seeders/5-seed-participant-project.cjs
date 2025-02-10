"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "ProjectParticipants",
      [
        {
          projectId: 1,
          participantId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 1,
          participantId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 1,
          participantId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 1,
          participantId: 7,
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          projectId: 2,
          participantId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 2,
          participantId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 2,
          participantId: 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          projectId: 2,
          participantId: 8,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ProjectParticipants", null, {});
  },
};

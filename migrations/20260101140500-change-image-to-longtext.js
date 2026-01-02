'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Baskets', 'image', {
      type: Sequelize.TEXT('long'),
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Baskets', 'image', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};

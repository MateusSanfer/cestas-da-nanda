'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Baskets', 'category', {
      type: Sequelize.STRING,
      defaultValue: 'cesta',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Baskets', 'category');
  }
};

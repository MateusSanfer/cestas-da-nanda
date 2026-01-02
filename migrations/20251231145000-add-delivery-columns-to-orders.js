'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'deliveryAddress', {
      type: Sequelize.JSON,
      allowNull: true
    });
    await queryInterface.addColumn('Orders', 'deliveryDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
    });
    await queryInterface.addColumn('Orders', 'deliveryPeriod', {
        type: Sequelize.STRING,
        allowNull: true
    });
    await queryInterface.addColumn('Orders', 'paymentMethod', {
        type: Sequelize.STRING,
        allowNull: true
    });
    await queryInterface.addColumn('Orders', 'message', {
        type: Sequelize.TEXT,
        allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'deliveryAddress');
    await queryInterface.removeColumn('Orders', 'deliveryDate');
    await queryInterface.removeColumn('Orders', 'deliveryPeriod');
    await queryInterface.removeColumn('Orders', 'paymentMethod');
    await queryInterface.removeColumn('Orders', 'message');
  }
};

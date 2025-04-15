'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Baskets', [
      {
        name: "Cesta Café da Manhã",
        image: "/images/cesta1.jpg",
        images: JSON.stringify([
          "/images/cesta2.jpg",
          "/images/cesta3.jpg",
          "/images/foto4.jpg"
        ]),
        description: "Deliciosa cesta com pães, frutas e café. A maioria das pesssoas só aprende as lições da vida, depois que a mão.",
        price: 130.0,
        includedItems: JSON.stringify([
          "4 Biscoitos salgados",
          "1 Barra de Cereal",
          "1 Bolinho",
          "1 Sachê de café ",
          "2 Geleias ",
          "1 Pão de mel",
          "2 chocolates ",
          "1 Achocolatado",
          "1 Iogurte",
          "1 Fruta",
          "1 Torrada",
          "1 Pão com frios",
          "1 Sucrilhos"
        ]),
        availableExtras: JSON.stringify([
          { name: "Caixa em MDF + 1 xícara + 1 Balão", price: 50 },
        { name: "1 Balão", price: 20 }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesta Com Amor",
        image: "/images/cesta2.jpg",
        images: JSON.stringify([
          "/images/cesta2.jpg",
          "/images/cesta3.jpg",
          "/images/foto4.jpg"
        ]),
        description: "Cesta especial com chocolates e vinho",
        price: 44.99,
        includedItems: JSON.stringify([
          "Cesta", "1 Mini vinho", "1 Taça", "1 Kit Kat", "Chocolates"
        ]),
        availableExtras: JSON.stringify([
          { name: "Ursinho com tolha de rosto", price: 15 }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesta Gourmet",
        image: "/images/cesta3.jpg",
        images: JSON.stringify([
          "/images/cesta2.jpg",
          "/images/cesta3.jpg",
          "/images/foto4.jpg"
        ]),
        description: "Seleção de queijos e frios premium",
        price: 194.99,
        includedItems: JSON.stringify([
          "Panetone 400g", "Vinho 750ml", "Taça", "Batata frita", "Snacks",
          "Chocolates", "Waffers", "Barrinha de cereal", "Mix passas", "Cappuccino"
        ]),
        availableExtras: JSON.stringify([
          { name: "Creme de avelã", price: 14.99 },
          { name: "Mini petisqueira de frios", price: 89.9 }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Cesta Fitness",
        image: "/images/foto4.jpg",
        images: JSON.stringify([
          "/images/cesta2.jpg",
          "/images/cesta3.jpg",
          "/images/foto4.jpg"
        ]),
        description: "Cesta com alimentos saudáveis e nutritivos",
        price: 179.9,
        includedItems: JSON.stringify([
          "Frutas diversas", "2 Barrinhas de Cereal", "Suco Detox", "Whey Protein 500g"
        ]),
        availableExtras: JSON.stringify([
          { name: "Shake Proteico", price: 60 },
          { name: "Kit de Vitaminas", price: 80 }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Baskets', null, {});
  }
};

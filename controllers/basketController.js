const { Basket } = require("../models");

module.exports = {
  async index(req, res) {
    const { category } = req.query;
    const where = category && category !== "todos" ? { category } : {};

    try {
      const baskets = await Basket.findAll({ where });
      res.json(baskets);
    } catch (error) {
      console.error("Error fetching baskets:", error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },

  async show(req, res) {
    const basket = await Basket.findByPk(req.params.id);
    if (!basket)
      return res.status(404).json({ error: "Cesta não encontrada GET" });
    res.json(basket);
  },

  async store(req, res) {
    try {
      const basket = await Basket.create(req.body);
      res.status(201).json(basket);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      res.status(500).json({ error: "Erro ao criar produto" });
    }
  },

  async update(req, res) {
    try {
      const basket = await Basket.findByPk(req.params.id);
      if (!basket)
        return res.status(404).json({ error: "Cesta não encontrada" });
      await basket.update(req.body);
      res.json(basket);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  },

  async destroy(req, res) {
    try {
      const basket = await Basket.findByPk(req.params.id);
      if (!basket)
        return res.status(404).json({ error: "Cesta não encontrada" });
      await basket.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      res.status(500).json({ error: "Erro ao excluir produto" });
    }
  },
};

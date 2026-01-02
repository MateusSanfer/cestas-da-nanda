const { Basket } = require('../models');

module.exports = {
  async index(req, res) {
    const { category } = req.query;
    const where = category && category !== 'todos' ? { category } : {};
    
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
    if (!basket) return res.status(404).json({ error: 'Cesta não encontrada GET' });
    res.json(basket);
  },

  async store(req, res) {
    const basket = await Basket.create(req.body);
    res.status(201).json(basket);
  },

  async update(req, res) {
    const basket = await Basket.findByPk(req.params.id);
    if (!basket) return res.status(404).json({ error: 'Cesta não encontrada PUSST' });
    await basket.update(req.body);
    res.json(basket);
  },

  async destroy(req, res) {
    const basket = await Basket.findByPk(req.params.id);
    if (!basket) return res.status(404).json({ error: 'Cesta não encontrada OPOSA' });
    await basket.destroy();
    res.status(204).send();
  }
};

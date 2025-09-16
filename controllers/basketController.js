const { Basket } = require('../models');

module.exports = {
  async index(req, res) {
    const baskets = await Basket.findAll();
    res.json(baskets);
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

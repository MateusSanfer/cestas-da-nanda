// routes/orders.js
const express = require('express');
const router = express.Router();

// Exemplo: GET /api/orders
router.get('/', (req, res) => {
  res.json({ message: 'Listando todos os pedidos (futuro banco de dados aqui)' });
});

module.exports = router;

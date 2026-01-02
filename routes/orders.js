const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { authenticate } = require('../middlewares/authMiddleware');

// GET /api/orders/me (Meus Pedidos) - Must be before /:id or generic /
router.get('/me', authenticate, OrderController.userIndex);

// GET /api/orders (Admin - Todos)
router.get('/', OrderController.index);

// POST /api/orders
router.post('/', OrderController.store);

// PUT /api/orders/:id (Update status)
router.put('/:id', OrderController.update);

module.exports = router;

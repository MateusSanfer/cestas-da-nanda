const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');
const { authenticate, requireAdmin } = require('../middlewares/authMiddleware');


// Rotas públicas
router.get('/', basketController.index);
router.get('/:id', basketController.show);

// Rotas protegidas (precisa estar logado e ser admin)
router.post('/', authenticate, requireAdmin, basketController.store);
router.put('/:id', authenticate, requireAdmin, basketController.update);
router.delete('/:id', authenticate, requireAdmin, basketController.destroy);


module.exports = router;

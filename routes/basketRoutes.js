const express = require('express');
const router = express.Router();
const basketController = require('../controllers/basketController');

router.get('/', basketController.index);
router.get('/:id', basketController.show);
router.post('/', basketController.store);
router.put('/:id', basketController.update);
router.delete('/:id', basketController.destroy);

module.exports = router;

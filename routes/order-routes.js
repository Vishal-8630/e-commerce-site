const express = require('express');

const orderController = require('../controllers/order-controller');

const router = express.Router();

router.get('/', orderController.getOrder);

router.post('/', orderController.addOrder);

module.exports = router;
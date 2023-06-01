const express = require('express');

const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/multer-middleware');

const router = express.Router();

// This is for serving the list of all products
router.get('/products', adminController.getProducts);

router.get('/products/new', adminController.getNewProducts);

// This is for adding new product 
router.post('/products', imageUploadMiddleware, adminController.createNewProducts);

// This is for updating the existing product
router.get('/products/:id', adminController.getUpdateProduct);

// This is for getting data of the updated product
router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);

// This is for deleting the products
router.delete('/products/:id', adminController.deleteProduct);
// router.post('/products/:id/delete', adminController.deleteProduct);

router.get('/orders', adminController.getOrder);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;
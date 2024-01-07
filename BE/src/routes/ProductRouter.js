/** @format */

const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const {authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');
router.post('/create', ProductController.createProduct);
router.put('/update/:id', authMiddleWare, ProductController.updateProduct);
router.delete('/delete/:id', authMiddleWare, ProductController.deleteProduct);
router.get('/get-details/:id', ProductController.getDetailsProduct);
router.get('/get-all', ProductController.getAllProduct);

module.exports = router;

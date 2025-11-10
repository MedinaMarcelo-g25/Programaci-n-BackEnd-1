const express = require('express');
const router = express.Router();
const Cart = require('../dao/models/cartModel');
const User = require('../dao/models/userModel');
const Product = require('../dao/models/productModel');
const { passportAuthenticate } = require('../middleware/passport.middleware');

router.get('/', passportAuthenticate('jwt'), async (req, res) => {
    try {
        let cart = await Cart.findOne({ 
            user: req.user._id, 
            status: 'active' 
        }).populate('products.product');

        if (!cart) {
            cart = await Cart.create({ 
                user: req.user._id,
                products: [],
                status: 'active'
            });
        }

        res.json({ status: 'success', cart });
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/products/:pid', passportAuthenticate('jwt'), async (req, res) => {
    try {
        const productId = req.params.pid;
        const quantity = parseInt(req.body.quantity) || 1;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Producto no encontrado' 
            });
        }

        let cart = await Cart.findOne({ 
            user: req.user._id, 
            status: 'active' 
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                products: [],
                status: 'active'
            });
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === productId
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        await cart.save();
        
        cart = await Cart.findById(cart._id).populate('products.product');
        
        res.json({ 
            status: 'success', 
            message: 'Producto agregado al carrito',
            cart 
        });
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.post('/checkout', passportAuthenticate('jwt'), async (req, res) => {
    try {
        const cart = await Cart.findOne({ 
            user: req.user._id, 
            status: 'active' 
        }).populate('products.product');

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'No hay productos en el carrito'
            });
        }

        for (const item of cart.products) {
            const product = item.product;
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: `Stock insuficiente para ${product.title}`
                });
            }
        }

        for (const item of cart.products) {
            await Product.findByIdAndUpdate(
                item.product._id,
                { $inc: { stock: -item.quantity } }
            );
        }

        cart.status = 'completed';
        await cart.save();

        res.json({
            status: 'success',
            message: 'Compra finalizada exitosamente',
            orderId: cart._id
        });
    } catch (error) {
        console.error('Error al finalizar compra:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
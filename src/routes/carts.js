const express = require('express');
const router = express.Router();

const CartManager = require('../managers/CartManager');
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(Number(req.params.cid));
        if (cart) {
            res.json(cart.products);
        } else {
            res.status(404).json({ error: 'El carrito no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(Number(cid), Number(pid));
        if (updatedCart) {
            res.json(updatedCart);
        } else {
            res.status(404).json({ error: 'El carrito no existe o el producto no es válido' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const CartManagerMongo = require('../managers/CartManagerMongo');

router.post('/', async (req, res) => {
  try {
    const newCart = await CartManagerMongo.create();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartManagerMongo.getById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const cart = await CartManagerMongo.addProduct(req.params.cid, req.params.pid, quantity);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/carts/:cid - Reemplazar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { products } = req.body; // [{ product: id, quantity }]
    const cart = await CartManagerMongo.updateAllProducts(req.params.cid, products);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await CartManagerMongo.updateProductQuantity(req.params.cid, req.params.pid, quantity);
    if (!cart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartManagerMongo.deleteProduct(req.params.cid, req.params.pid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await CartManagerMongo.deleteAllProducts(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
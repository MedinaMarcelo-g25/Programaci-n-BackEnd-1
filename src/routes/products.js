const express = require('express');
const router = express.Router();

const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(Number(req.params.pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'El producto no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || price == null || status == null || !stock || !category) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const { id, ...fields } = req.body; 
        const updatedProduct = await productManager.updateProduct(Number(req.params.pid), fields);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'El producto no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const deleted = await productManager.deleteProduct(Number(req.params.pid));
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'El producto no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});

module.exports = router;
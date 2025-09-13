const express = require('express');
const router = express.Router();
const Product = require('../managers/models/productModel');
const Cart = require('../managers/models/cartModel');
const ProductManagerMongo = require('../managers/ProductManagerMongo');

router.get('/home', async (req, res) => {
  const result = await ProductManagerMongo.getAll({}, { lean: true, limit: 100 });
  res.render('home', { products: result.docs });
});

router.get('/realtimeproducts', async (req, res) => {
  const result = await ProductManagerMongo.getAll({}, { lean: true, limit: 100 });
  res.render('realTimeProducts', { products: result.docs, title: 'Productos en tiempo real' });
});

router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;
  const filter = {};

  if (query) {
    if (query === 'true' || query === 'false') {
      filter.status = query === 'true';
    } else {
      filter.category = query;
    }
  }

  let sortOption = {};
  if (sort === 'asc') sortOption.price = 1;
  if (sort === 'desc') sortOption.price = -1;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOption,
    lean: true
  };

  const result = await Product.paginate(filter, options);

  res.render('products', {
    products: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    limit,
    cartId: "ID_DEL_CARRITO" 
  });
});

router.get('/products/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid).lean();
  res.render('productDetail', { product, cartId: "ID_DEL_CARRITO" });
});

router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid).populate('products.product').lean();
  res.render('cart', { cart });
});

module.exports = router;
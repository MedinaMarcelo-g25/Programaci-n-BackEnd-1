const ProductRepository = require('../dao/repositories/product.repository');
const Product = require('../dao/models/productModel');

const repo = new ProductRepository(Product);

class ProductService {
  async create(productData) {
    return repo.create(productData);
  }

  async update(id, data) {
    return repo.update(id, data);
  }

  async delete(id) {
    return repo.delete(id);
  }

  async getAll(filter = {}) {
    return repo.findAll(filter);
  }

  async getById(id) {
    return repo.findById(id);
  }

  async reserveStock(items = []) {
    const failed = [];
    const updated = [];

    for (const it of items) {
      const product = await repo.findById(it.productId);
      if (!product || product.stock < it.quantity) {
        failed.push({ productId: it.productId, available: product ? product.stock : 0 });
        continue;
      }
      product.stock -= it.quantity;
      await product.save();
      updated.push({ productId: it.productId, left: product.stock });
    }

    return { success: failed.length === 0, failed, updated };
  }
}

module.exports = new ProductService();
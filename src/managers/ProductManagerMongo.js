const Product = require('../managers/models/productModel');

class ProductManagerMongo {
    static async getAll(filter = {}, options = {}) {
        return await Product.paginate(filter, options);
    }

    static async getById(id) {
        return await Product.findById(id).lean();
    }

    static async create(productData) {
        return await Product.create(productData);
    }

    static async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    static async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

module.exports = ProductManagerMongo;
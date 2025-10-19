const Cart = require('./models/cartModel');

class CartManagerMongo {
    static async create() {
        return await Cart.create({ products: [] });
    }

    static async getById(cid) {
        return await Cart.findById(cid).populate('products.product').lean();
    }

    static async addProduct(cid, pid, quantity = 1) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        const prodInCart = cart.products.find(p => p.product.toString() === pid);
        if (prodInCart) {
            prodInCart.quantity += Number(quantity);
        } else {
            cart.products.push({ product: pid, quantity: Number(quantity) });
        }
        await cart.save();
        return cart;
    }

    static async updateAllProducts(cid, products) {
        return await Cart.findByIdAndUpdate(cid, { products }, { new: true });
    }

    static async updateProductQuantity(cid, pid, quantity) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        const prod = cart.products.find(p => p.product.toString() === pid);
        if (!prod) return null;
        prod.quantity = Number(quantity);
        await cart.save();
        return cart;
    }

    static async deleteProduct(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();
        return cart;
    }

    static async deleteAllProducts(cid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;
        cart.products = [];
        await cart.save();
        return cart;
    }
}

module.exports = CartManagerMongo;
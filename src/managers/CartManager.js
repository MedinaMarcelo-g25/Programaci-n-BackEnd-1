class CartManager {
    constructor() {
        this.carts = [];
        this.loadCarts();
    }

    loadCarts() {
        try {
            const data = require('../data/carts.json');
            this.carts = data;
        } catch (error) {
            this.carts = [];
        }
    }

    saveCarts() {
        const fs = require('fs');
        fs.writeFileSync('../data/carts.json', JSON.stringify(this.carts, null, 2));
    }

    createCart() {
        const newCart = {
            id: this.generateId(),
            products: []
        };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(cid) {
        return this.carts.find(cart => cart.id === cid);
    }

    addProductToCart(cid, pid, quantity = 1) {
        const cart = this.getCartById(cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.id === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: pid, quantity });
        }
        this.saveCarts();
        return cart;
    }

    generateId() {
        return this.carts.length > 0 ? Math.max(...this.carts.map(cart => cart.id)) + 1 : 1;
    }
}

module.exports = CartManager;
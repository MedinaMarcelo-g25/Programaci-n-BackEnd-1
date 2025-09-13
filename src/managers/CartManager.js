const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/carts.json');

class CartManager {
    constructor() {
        this.carts = [];
    }

    async loadCarts() {
        if (fs.existsSync(filePath)) {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            this.carts = JSON.parse(data);
        } else {
            this.carts = [];
        }
    }

    async saveCarts() {
        await fs.promises.writeFile(filePath, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        await this.loadCarts();
        const newCart = {
            id: this.generateId(),
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cid) {
        await this.loadCarts();
        return this.carts.find(cart => cart.id === cid);
    }

    async addProductToCart(cid, pid, quantity = 1) {
        await this.loadCarts();
        const cart = this.carts.find(cart => cart.id === cid);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(product => product.id === pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: pid, quantity });
        }
        await this.saveCarts();
        return cart;
    }

    generateId() {
        if (this.carts.length === 0) return 1;
        return Math.max(...this.carts.map(c => typeof c.id === 'number' ? c.id : parseInt(c.id))) + 1;
    }
}

//module.exports = CartManager;
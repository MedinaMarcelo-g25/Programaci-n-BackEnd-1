const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    constructor() {
        this.products = [];
    }

    async loadProducts() {
        if (fs.existsSync(filePath)) {
            const data = await fs.promises.readFile(filePath, 'utf-8');
            this.products = JSON.parse(data);
        } else {
            this.products = [];
        }
    }

    async saveProducts() {
        try {
            await fs.promises.writeFile(filePath, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    async getAllProducts() {
        await this.loadProducts();
        return this.products;
    }

    async getProductById(id) {
        await this.loadProducts();
        return this.products.find(product => product.id === id);
    }

    async addProduct(product) {
        await this.loadProducts();
        const maxId = this.products.length > 0
            ? Math.max(...this.products.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id)))
            : 0;
        product.id = maxId + 1;
        this.products.push(product);
        await this.saveProducts();
        return product;
    }

    async updateProduct(id, updatedFields) {
        await this.loadProducts();
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return null;
        }
        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        await this.saveProducts();
        return updatedProduct;
    }

    async deleteProduct(id) {
        await this.loadProducts();
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) return false;
        this.products.splice(index, 1);
        await this.saveProducts();
        return true;
    }
}

module.exports = ProductManager;
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    constructor() {
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf-8');
            this.products = JSON.parse(data);
        }
    }

    saveProducts() {
        fs.writeFileSync(filePath, JSON.stringify(this.products, null, 2));
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    addProduct(product) {
        const maxId = this.products.length > 0
            ? Math.max(...this.products.map(p => typeof p.id === 'number' ? p.id : parseInt(p.id)))
            : 0;
        product.id = maxId + 1;
        this.products.push(product);
        this.saveProducts();
        return product;
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return null;
        }
        const updatedProduct = { ...this.products[productIndex], ...updatedFields };
        this.products[productIndex] = updatedProduct;
        this.saveProducts();
        return updatedProduct;
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) {
            return null;
        }
        const deletedProduct = this.products.splice(productIndex, 1);
        this.saveProducts();
        return deletedProduct;
    }
}

module.exports = ProductManager;
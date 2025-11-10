class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.title = product.title || product.name || '';
    this.price = product.price || 0;
    this.stock = product.stock || 0;
    this.category = product.category || '';
    this.thumbnail = product.thumbnail || '';
  }
}

module.exports = ProductDTO;
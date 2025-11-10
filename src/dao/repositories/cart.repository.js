class CartRepository {
  constructor(model) { this.model = model; }
  async create(data) { return this.model.create(data); }
  async findById(id) { return this.model.findById(id).populate('products.product').lean(); }
  async addProduct(cartId, productId, quantity = 1) {
    const cart = await this.model.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    const existing = cart.products.find(p => p.product.toString() === productId.toString());
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }
    return cart.save();
  }
  async removeProduct(cartId, productId) {
    const cart = await this.model.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    cart.products = cart.products.filter(p => p.product.toString() !== productId.toString());
    return cart.save();
  }
  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await this.model.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');
    const item = cart.products.find(p => p.product.toString() === productId.toString());
    if (!item) throw new Error('Producto no en carrito');
    item.quantity = quantity;
    return cart.save();
  }
}

module.exports = CartRepository;
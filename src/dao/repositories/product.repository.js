class ProductRepository {
  constructor(model) { this.model = model; }
  async create(data) { return this.model.create(data); }
  async findById(id) { return this.model.findById(id); }
  async findAll(filter = {}) { return this.model.find(filter).lean(); }
  async findOne(filter = {}) { return this.model.findOne(filter); }
  async update(id, data) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id) { return this.model.findByIdAndDelete(id); }
}

module.exports = ProductRepository;
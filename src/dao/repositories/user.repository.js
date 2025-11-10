class UserRepository {
  constructor(model) { this.model = model; }
  async create(data){ return this.model.create(data); }
  async findById(id){ return this.model.findById(id); }
  async findByEmail(email){ return this.model.findOne({ email }); }
  async update(id, data){ return this.model.findByIdAndUpdate(id, data, { new: true }); }
}
module.exports = UserRepository;
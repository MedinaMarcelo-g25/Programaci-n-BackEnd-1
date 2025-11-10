const UserRepository = require('../dao/repositories/user.repository');
const User = require('../dao/models/userModel');

const repo = new UserRepository(User);

class UserService {
  async register(userData) {
    const email = userData.email?.toLowerCase().trim();
    if (!email) throw new Error('Email requerido');
    const exists = await repo.findByEmail(email);
    if (exists) throw new Error('Email ya registrado');
    userData.email = email;
    return repo.create(userData);
  }

  async getByEmail(email) {
    return repo.findByEmail(email?.toLowerCase().trim());
  }

  async getById(id) {
    return repo.findById(id);
  }

  async updateUser(id, update) {
    if (update.email) update.email = update.email.toLowerCase().trim();
    return repo.update(id, update);
  }

  async changePassword(email, newPassword) {
    const user = await repo.findByEmail(email.toLowerCase().trim());
    if (!user) throw new Error('Usuario no encontrado');
    const same = await user.comparePassword(newPassword);
    if (same) throw new Error('La nueva contraseña no puede ser igual a la anterior');
    user.password = newPassword;
    return user.save();
  }
}

module.exports = new UserService();
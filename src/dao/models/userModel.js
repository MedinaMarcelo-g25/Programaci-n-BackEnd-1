const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, trim: true },
  last_name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  age: { type: Number },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
  role: { type: String, default: 'user' }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: Number,
    password: String,
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'user'
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
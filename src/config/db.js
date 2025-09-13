const mongoose = require('mongoose');

const connectDB = async (mongoUrl, dbName) => {
  try {
    await mongoose.connect(`${mongoUrl}/${dbName}`);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
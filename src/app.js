const express = require('express');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const ProductManagerMongo = require('./managers/ProductManagerMongo');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { dbConfig } = require('./config/config');

const app = express();
const productManager = ProductManagerMongo; 

const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');

const hbs = exphbs.create({
  helpers: {
    range: function(start, end, options) {
      let arr = [];
      for (let i = start; i <= end; i++) arr.push(i);
      return arr;
    },
    ifEquals: function(arg1, arg2, options) {
      return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));
app.use(express.static(path.join(__dirname, 'public'))); 

const viewsRouter = require('./routes/views');
app.use('/', viewsRouter);

const PORT = dbConfig.PORT;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

app.set('io', io);

io.on('connection', async (socket) => {
  const products = await productManager.getAll(); 
  socket.emit('products', products.docs); 

  socket.on('addProduct', async (data) => {
    await productManager.create({ ...data, description: '', code: '', status: true, stock: 1, category: '', thumbnails: [] });
    const updatedProducts = await productManager.getAll();
    io.emit('products', updatedProducts.docs);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.delete(id);
    const updatedProducts = await productManager.getAll();
    io.emit('products', updatedProducts.docs);
  });
});

connectDB(
  dbConfig.MONGO_URL,
  dbConfig.DB_NAME
)
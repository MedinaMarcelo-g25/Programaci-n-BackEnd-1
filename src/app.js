const express = require('express');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const ProductManager = require('./managers/ProductManager');

const app = express();
const productManager = new ProductManager();

app.engine('hbs', engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use('/api/products', require('./routes/products'));
app.use('/api/carts', require('./routes/carts'));
app.use(express.static(path.join(__dirname, 'public'))); 

const viewsRouter = require('./routes/views');
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = new Server(httpServer);

app.set('io', io);

io.on('connection', async (socket) => {
  const products = await productManager.getAllProducts();
  socket.emit('products', products);

  socket.on('addProduct', async (data) => {
    await productManager.addProduct({ ...data, description: '', code: '', status: true, stock: 1, category: '', thumbnails: [] });
    const updatedProducts = await productManager.getAllProducts();
    io.emit('products', updatedProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(Number(id));
    const updatedProducts = await productManager.getAllProducts();
    io.emit('products', updatedProducts);
  });
});

module.exports = app;
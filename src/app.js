const express = require('express');
const { Server } = require('socket.io');
const { engine } = require('express-handlebars');
const path = require('path');
const ProductManagerMongo = require('./dao/ProductManagerMongo');
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const { dbConfig } = require('./config/config');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const sessionsRouter = require('./routes/sessions.router');
const usersRouter = require('./routes/users.router');
const { verifyToken } = require('./utils/jwt.utils');

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
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
initializePassport(passport);

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const decoded = verifyToken(auth.split(' ')[1]);
      res.locals.user = decoded;
      req.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

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
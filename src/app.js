require('dotenv').config();
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
const cookieParser = require('cookie-parser');
const cartsRouter = require('./routes/carts');

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

app.use(cookieParser());

app.use(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    res.locals.user = null;
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const User = require('./dao/models/userModel');
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      res.locals.user = null;
      req.user = null;
      return next();
    }

    req.user = user;        
    res.locals.user = user; 
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.locals.user = null;
    req.user = null;
  }

  next();
});

const viewsRouter = require('./routes/views');
app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartsRouter);

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

module.exports = app;
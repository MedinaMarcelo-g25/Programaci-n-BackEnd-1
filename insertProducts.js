const mongoose = require('mongoose');
const Product = require('./src/dao/models/productModel'); 

const productos = [
  {
    title: "iPhone 15 Pro Max",
    description: "Apple iPhone 15 Pro Max 256GB, Titanium, pantalla Super Retina XDR",
    code: "IPH15PM256",
    price: 1200000,
    status: true,
    stock: 15,
    category: "Celulares",
    thumbnails: ["img/iphone15promax.jpg"]
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description: "Samsung Galaxy S24 Ultra 512GB, Phantom Black, cámara 200MP",
    code: "SGS24U512",
    price: 1100000,
    status: true,
    stock: 10,
    category: "Celulares",
    thumbnails: ["img/galaxys24ultra.jpg"]
  },
  {
    title: "Xiaomi 14 Pro",
    description: "Xiaomi 14 Pro 256GB, pantalla AMOLED, Snapdragon 8 Gen 3",
    code: "XIA14P256",
    price: 800000,
    status: true,
    stock: 20,
    category: "Celulares",
    thumbnails: ["img/xiaomi14pro.jpg"]
  },
  {
    title: "Google Pixel 8 Pro",
    description: "Google Pixel 8 Pro 128GB, cámara avanzada, Android 14",
    code: "PIX8P128",
    price: 950000,
    status: true,
    stock: 12,
    category: "Celulares",
    thumbnails: ["img/pixel8pro.jpg"]
  },
  {
    title: "Motorola Edge 50 Pro",
    description: "Motorola Edge 50 Pro 512GB, cámara triple, pantalla OLED",
    code: "MOTOE50P512",
    price: 700000,
    status: true,
    stock: 8,
    category: "Celulares",
    thumbnails: ["img/motoedge50pro.jpg"]
  },
  {
    title: "Smart TV Samsung 55\" 4K",
    description: "Smart TV Samsung 55 pulgadas, resolución 4K UHD, Tizen OS",
    code: "TVSAM55UHD",
    price: 600000,
    status: true,
    stock: 5,
    category: "Televisores",
    thumbnails: ["img/samsungtv55.jpg"]
  },
  {
    title: "Notebook Dell Inspiron 15",
    description: "Dell Inspiron 15, Intel i7, 16GB RAM, 512GB SSD",
    code: "DELLINSP15",
    price: 850000,
    status: true,
    stock: 7,
    category: "Notebooks",
    thumbnails: ["img/dellinspiron15.jpg"]
  },
  {
    title: "Tablet iPad Air 5ta Gen",
    description: "Apple iPad Air 5ta generación, 64GB, Wi-Fi",
    code: "IPADAIR5",
    price: 500000,
    status: true,
    stock: 9,
    category: "Tablets",
    thumbnails: ["img/ipadair5.jpg"]
  },
  {
    title: "Auriculares Sony WH-1000XM5",
    description: "Auriculares inalámbricos Sony con cancelación de ruido",
    code: "SONYWH1000XM5",
    price: 300000,
    status: true,
    stock: 18,
    category: "Audio",
    thumbnails: ["img/sonywh1000xm5.jpg"]
  },
  {
    title: "Smartwatch Samsung Galaxy Watch 6",
    description: "Samsung Galaxy Watch 6, 44mm, Bluetooth",
    code: "SGW6BT44",
    price: 250000,
    status: true,
    stock: 14,
    category: "Wearables",
    thumbnails: ["img/galaxywatch6.jpg"]
  }
];

const MONGO_URL = "mongodb+srv://coder:codercoder@cluster0.842ike1.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "ecommerce";

mongoose.connect(`${MONGO_URL}/${DB_NAME}`)
  .then(async () => {
    await Product.insertMany(productos);
    console.log('Productos insertados correctamente');
    
    const inserted = await Product.find();
    console.log('Productos en la colección:', inserted.length);
    console.log(inserted);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Error al insertar productos:', err);
  });
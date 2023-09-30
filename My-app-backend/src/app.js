import express from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './models/ProductManager.js';
import productRouter from './routes/product.js';
import cartsRouter from './routes/carts.js';
import path from 'path';
//import mongoose from 'mongoose';

const app = express();
const httpServer = app.listen(8080, () => console.log("Escuchando el puerto 8080"));
const io = new Server(httpServer);

const productManager = new ProductManager('src/data/products.json');

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
    console.log('usuario conectado');

    socket.on('createProduct', async (newProductData) => {
        try {
            const newProduct = await productManager.addProduct(newProductData);
            io.emit('productCreated', newProduct);
        } catch (error) {
            socket.emit('productCreateError', error.message);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            const deletedProduct = await productManager.deleteProduct(productId);
            io.emit('productDeleted', deletedProduct.id);
        } catch (error) {
            socket.emit('productDeleteError', error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('usuario desconectado');
    });
});

/* try{
    await mongoose.connect('mongodb+srv://nicocmoh:89EBno2iFNT4W9YW@cluster47300nm.ik8zzdc.mongodb.net/?retryWrites=true&w=majority');
    console.log('conectado a BBD')
} catch(error){
    console.log(error.message)
}; */

export default app;
export { io };




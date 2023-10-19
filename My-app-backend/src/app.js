import express from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import ProductManager from './DAO/dbManager/dbProductManager.js';
import productRouter from './routes/product.js';
import cartsRouter from './routes/carts.js';
import chatRouter from './routes/chat.js';
import path from 'path';
import mongoose from 'mongoose';
import { messageModel } from './DAO/models/messageModel.js';
import { productModel } from './DAO/models/productsModel.js';
import productInfo from './data/products.json' assert {type: 'json'};

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
app.use('/chat', chatRouter);



let messages = [];

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

    socket.on('authenticate', async () => {
        try {
            const messageLogs = await messageModel.find().sort({ timestamp: 1 });
            io.emit('messageLogs', messageLogs);
        } catch (error) {
            console.error('Error al recuperar registros de mensajes:', error);
        }
    });

    socket.on('message', async (data) => {
        try {
            const newMessage = new messageModel({
                user: data.user,
                message: data.message,
                timestamp: new Date(),
            });

            await newMessage.save();

            io.emit('messageLogs', [newMessage]);
        } catch (error) {
            console.error('Error al guardar el mensaje:', error);
        }
    });


    socket.on('disconnect', () => {
        console.log('usuario desconectado');
    });
});

/* try {
    await mongoose.connect('mongodb+srv://nicocmoh:89EBno2iFNT4W9YW@cluster47300nm.ik8zzdc.mongodb.net/ecommerce?retryWrites=true&w=majority');
    console.log('conectado a BBD')
} catch (error) {
    console.log(error.message)
}; */

const enviroment = async () => {
    try {
        await mongoose.connect('mongodb+srv://nicocmoh:89EBno2iFNT4W9YW@cluster47300nm.ik8zzdc.mongodb.net/ecommerce?retryWrites=true&w=majority');
        console.log('conectado a BBD')
        //const responseInsert = await productModel.insertMany(productInfo);
        //const responseInsert = await productModel.paginate({},{limit:5, page:1});
        //console.log(JSON.stringify(responseInsert, null,'\t'));
    } catch (error) {
        console.log(error);
    }

}
enviroment();

export default app;
export { io };




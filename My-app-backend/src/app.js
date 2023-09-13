import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';

import productRouter from './routes/product.js';
import cartsRouter from './routes/carts.js';

const app = express();
const httpServer = app.listen(8080, () => console.log("Escuchando el puerto 8080"));
const io = new Server(httpServer);


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views',__dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);






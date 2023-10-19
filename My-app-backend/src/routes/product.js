import express from 'express';
import ProductManager from '../DAO/dbManager/dbProductManager.js';
import { io } from '../app.js';
import { productModel } from '../DAO/models/productsModel.js';

const productRouter = express.Router();
const productManager = new ProductManager('src/data/products.json');

productRouter.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

productRouter.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

productRouter.get('/', async (req, res) => {

    try {
        const { page = 1 } = req.query;
        const { docs, hasPrevPage, hasNextPage, nextPage, prevPage } = await productModel.paginate({}, { limit: 5, page, lean: true });

        const products = docs;

        res.render('products', {
            products,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage
        })
        console.log(JSON.stringify(products, null,'\t'));
    } 

    catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error al obtener productos' })
    }
});

productRouter.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Producto no encontrado' })
    }
});

productRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' })
        }
        //const idNuevo = await productManager.addProducts(title, description, price, code, thumbnail, stock);
        const newProductData = {
            title,
            description,
            price,
            code,
            stock,
            thumbnail,
        };
        const newProduct = await productManager.addProduct(newProductData);
        //const updatedProducts = await productManager.getProducts();

        io.emit('createProduct', newProduct);

        res.status(201).json({ message: 'Producto creado', productId: newProduct._id });

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


productRouter.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedData = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(id, updatedData);
        io.emit('updateProduct', updatedProduct);
        res.status(201).json({ message: 'Producto actualizado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


productRouter.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        const deletedProduct = await productManager.deleteProduct(productId);

        io.emit('deleteProduct', deletedProduct);

        res.status(201).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default productRouter;




import express from 'express';
import ProductManager from '../DAO/dbManager/dbProductManager.js';
import { io } from '../app.js';


const productRouter = express.Router();
const productManager = new ProductManager('src/data/products.json');

productRouter.get('/home', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

productRouter.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

productRouter.get('/', async (req, res) => {

    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if (isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
});

productRouter.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await productManager.getProductById(id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto por ID' })
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
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


productRouter.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const updatedData = req.body;

    try {
        const updatedProduct = await productManager.updateProduct(id, updatedData);
        io.emit('updateProduct', updatedProduct);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


productRouter.delete('/:id', async (req, res) => {
    const productId = parseInt(req.params.id);

    try {
        const deletedProduct =await productManager.deleteProduct(productId);
        
        io.emit('deleteProduct', deletedProduct);

        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default productRouter;




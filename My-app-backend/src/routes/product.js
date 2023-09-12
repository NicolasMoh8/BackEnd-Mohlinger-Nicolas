import express from 'express';
import ProductManager from '../models/ProductManager.js';

const productRouter = express.Router();
const productManager = new ProductManager('src/data/products.json');

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
        const idNuevo = await productManager.addProducts(title, description, price, thumbnail, code, stock);
        res.status(201).json({ message: 'Producto creado', productId: idNuevo });

    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});


productRouter.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const updated = req.body;

    try {
        await productManager.updateProduct(id, updated);
        res.json({ message: 'Producto actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


productRouter.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);

    try {
        await productManager.deleteProduct(id);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default productRouter;




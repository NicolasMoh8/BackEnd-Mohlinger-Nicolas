import express from 'express';
import CartManager from '../DAO/dbManager/dbCartManager.js';
import ProductManager from '../DAO/fileManager/ProductManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager('src/data/carts.json');


cartsRouter.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);

        } else {
            res.status(404).json({ error: 'Carritono encontrado' });
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' })
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const generateCartId = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado', cartId: generateCartId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;
        const product = await ProductManager.getProductById(productId);
        if(!product){
            return res.status(404).json({error: 'Producto no encontrado'})
        }
        await cartManager.addProductToCart(cartId, productId, quantity);

        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }

});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        await cartManager.removeProductFromCart(cartId, productId);
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const products = req.body.products; 
        await cartManager.updateCart(cartId, products);
        res.json({ message: 'Carrito actualizado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el carrito' });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;
        await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json({ message: 'Cantidad del producto en el carrito actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        await cartManager.removeAllProductsFromCart(cartId);
        res.json({ message: 'Todos los productos eliminados del carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar todos los productos del carrito' });
    }
});

export default cartsRouter;







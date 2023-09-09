import express from 'express';
import fs from "fs/promises";
const cartsRouter = express.Router();

async function loadCarts() {
    try {

        const data = await fs.readFile('carts.json', 'utf-8');
        return JSON.parse(data)

    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        return [];
    }

};

async function saveCarts(carts) {
    try {
        await fs.writeFile('carts.json', JSON.stringify(carts, null, 6), 'utf-8');
    } catch (error) {
        console.error('Error al guardar:', error)
    }
}

cartsRouter.get('/:cid', async (req, res) => {

    try {
        const cartId = parseInt(req.params.cid);
        const carts = await loadCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' })
    }
});



cartsRouter.post('/', async (req, res) => {
    try {
        const carts = await loadCarts();
        const generateCartId = carts.length > 0 ? Math.max(...carts.map(cart => cart.id)) + 1 : 1;
        const newCart = {
            id: generateCartId,
            products: req.body.products || [],
        };
        carts.push(newCart);
        await saveCarts(carts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear' });
    }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = loadCarts();
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity || 1;

        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) {
            return res.status(404).json({ error: 'No se ha encontrado el carrito' });
        }

        const agregarProd = {
            productId, quantity
        };

        const prodExist = cart.products.find(item => item.productId === productId);
        if (prodExist) {
            prodExist.quantity += quantity;
        } else {
            cart.products.push(agregarProd);
        }
        await saveCarts(carts);

        res.status(201).json({ message: 'Producto agregado al carrito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

export { cartsRouter as cartsRouter };







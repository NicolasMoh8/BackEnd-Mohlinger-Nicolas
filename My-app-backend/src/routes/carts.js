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
        const cartId = req.params.cid;
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

export { cartsRouter as cartsRouter };





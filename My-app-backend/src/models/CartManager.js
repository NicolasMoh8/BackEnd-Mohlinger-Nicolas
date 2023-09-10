import fs from "fs/promises";

class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.carts = [];
        this.uniqueId = 1;
        this.loadCarts();
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts), 'utf-8');
        } catch (error) {
            console.error('Error al guardar:', error)
        }
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
            this.uniqueId = this.carts.length + 1;
            return this.carts;

        } catch (error) {
            this.carts = [];
        }
    }

    async createCart() {
        const newCart = {
            id: this.uniqueId,
            products: [],
        };
        this.uniqueId++;
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart.id;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const existingProduct = cart.products.find((product) => product.productId === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        await this.saveCarts();
    }


    async getCartById(cartId) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        return cart || null;
    }
}

export default CartManager;



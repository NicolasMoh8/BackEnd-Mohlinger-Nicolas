import {cartModel} from '../models/cartsModel.js';
import { productModel } from '../models/productsModel.js';


export default class CartManager {
    constructor() {
        
    }

    async createCart(userId) {
        try {
            const newCart = new cartModel({
                userId,
                products: [],
                totalPrice: 0,
            });

            await newCart.save();
            return newCart;

        } catch (error) {
            console.log(error)
            throw new Error('Error al crear el carrito en la base de datos');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado en la base de datos');
            }
            const product = await productModel.findById(productId);
            if(!product){
                throw new Error('Producto no enontrado en la base de datos');
            }
            const productToAdd = {
                productId: productId,
                quantity: quantity,
            };

            cart.products.push(productToAdd);
            cart.totalPrice += product.price * quantity;

            await cart.save();

            return cart;
        } catch (error) {
            console.log(error)
            throw new Error('Error al agregar producto al carrito en la base de datos');
        }
    }


    async getCartById(cartId) {
        try {
            const cart = await cartModel.findById(cartId);

            if (!cart) {
                throw new Error('Carrito no encontrado en la base de datos');
            }

            return cart;
        } catch (error) {
            console.log(error)
            throw new Error('Error al obtener el carrito por ID en la base de datos');
        }
    }
}




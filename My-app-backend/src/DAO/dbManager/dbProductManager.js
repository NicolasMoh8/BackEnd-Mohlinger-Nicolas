import { productModel } from '../models/productsModel.js';

export default class ProductManager {
    constructor() {
        console.log('Trabajando desde BDD');
    }

    async addProduct(title, description, price, code, stock) {
        try {
            const newProduct = new productModel({
                title,
                description,
                price,
                code,
                stock,
            });


            await newProduct.save();

            return newProduct;
        } catch (error) {
            throw new Error('Error al agregar el producto');
        }
    }

    async getProductById(productId) {
        try {

            const product = await productModel.findById(productId);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error('Error al obtener el producto por ID');
        }
    }

    async updateProduct(productId, updatedData) {
        try {

            const product = await productModel.findByIdAndUpdate(
                productId,
                updatedData,
                {
                    new: true,
                }
            );

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error('Error al actualizar el producto');
        }
    }

    async deleteProduct(productId) {
        try {

            const product = await productModel.findByIdAndDelete(productId);

            if (!product) {
                throw new Error('Producto no encontrado');
            }

            return product;
        } catch (error) {
            throw new Error('Error al eliminar el producto');
        }
    }

    async getProducts() {
        try {
            const products = await productModel.find();
            return products;
        } catch (error) {
            throw new Error('Error al obtener los productos');
        }
    }
};


import fs from "fs/promises";

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.uniqueId = 1;
        this.getProducts();
    }

    async guardarProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
        } catch (error) {
            console.error("Error al guardar los productos", error);
        }

    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.uniqueId = this.products.length + 1;
            return this.products;
        } catch (error) {
            this.products = [];
        }
    }

    generarId() {
        const id = this.uniqueId;
        this.uniqueId++;
        return id;
    }

    async addProducts(title, description, price, code, stock, category, thumbnail=[], status=true) {
        const fields = [title, description, price, code, stock, category];
        if (fields.some(field => field === undefined || field === null)) {
            throw new Error("Todos los campos son obligatorios");
        }

        const codeExist = this.products.some(product => product.code === code);
        if (codeExist) {
            throw new Error("Producto repetido");
        }
        const id = this.generarId();

        const newProd = {
            id: id.toString(),
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnail,
            status,
        }
        this.products.push(newProd);
        await this.guardarProducts();
        console.log("Producto agregado: ", newProd);
    }

    async getProductById(id) {
        await this.getProducts();
        const product = this.products.find(product => product.id.toString() === id);
        if (product) {
            return product
        } else {
            console.log("No se encontro el producto1")
            return null;
        }

    }

    async updateProduct(id, updated) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updated,
                id: id
            };
            try {
                await this.guardarProducts();
                console.log('Se actualizo el producto', this.products[productIndex])
            } catch (error) {
                console.error('Error al guardar los productos:', error);
            }
        } else {
            console.log('No se encontro el producto');
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            try {
                await this.guardarProducts();
                console.log('Producto borrado: ', deletedProduct);
            } catch (error) {
                console.error('Error al guardar los productos:', error)
            }
        } else {
            console.log('No se encontro el producto3');
        }
    }

}

export default ProductManager;



const fs = require("fs").promises;

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.uniqueId = 1;
        this.cargaProducts();
    }

    async cargaProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.uniqueId = this.products.length + 1;
        } catch (error) {
            this.products = [];
        }
    }

    async guardarProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products), 'utf-8');
        } catch (error) {
            console.error("Error al guardar los productos", error);
        }

    }

    getProducts() {
        this.cargaProducts();
        return this.products;
    }

    generarId() {
        const id = this.uniqueId;
        this.uniqueId++;
        return id;
    }

    addProducts(title, description, price, thumbnail, code, stock) {
        const fields = [title, description, price, thumbnail, code, stock];
        if (fields.some(field => field === undefined || field === null)) {
            throw new Error("Todos los campos son obligatorios");
        }

        const codeExist = this.products.some(product => product.code === code);
        if (codeExist) {
            throw new Error("Producto repetido");
        }
        const id = this.generarId();

        const newProd = {
            id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        this.products.push(newProd);
        this.guardarProducts();
        console.log("Producto agregado: ", newProd);
    }

    async getProductById(id) {
        await this.cargaProducts();
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
                ...updated
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

(async () => {
    try {
        const productManager = new ProductManager('./index.json');

        console.log("Lista de productos al inicio", productManager.getProducts());

        await productManager.addProducts(
            "Sieger Criadores por 20 kg",
            "Alimento balanceado para mascotas",
            "10000",
            "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-All-In-One-Criadores.png",
            '1',
            30
        );

        await productManager.addProducts(
            "Sieger Adult Medium & Large por 15 kg",
            "Alimento balanceado para mascotas",
            "5000",
            "https://sieger.com.ar/wp-content/uploads/2022/09/adult-medium-and-large.png",
            '2',
            10,
        );

        await productManager.addProducts(
            "Sieger Puppy Medium & Large por 15 kg",
            "Alimento balanceado para mascotas",
            "8000",
            "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Puppy-Medium-Large.png",
            '3',
            20,
        );

        console.log("Lista de productos despues de agregar: ", productManager.products);

        const productById = await productManager.getProductById('1');
        if (productById) {
            console.log("Producto encontrado",await productById)
        } else {
            console.log("Producto no encontrado");
        }

        await productManager.updateProduct(3, {
            title: "Producto Actualizado",
            price: 100000
        })


        console.log("Producto actualizado", productManager.products);
        await productManager.deleteProduct(3);
        console.log("Lista final:", await productManager.getProducts());


    } catch (error) {
        console.error(error)
    }
})();
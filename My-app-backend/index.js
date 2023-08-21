const fs = require("fs");

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.uniqueId = 1;
        this.cargaProducts();
    }

    cargaProducts() {
        try {
            const data = readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
            this.uniqueId = this.products.length + 1;
        } catch (error) {
            this.products = [];
        }
    }

    guardarProducts() {
        fs.writeFileSync(this.path, JSON.stringify(this.products), 'utf-8');
    }

    getProducts() {
        this.cargaProducts();
        return this.products;
    }

    generarId(){
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
        const id=this.generarId();

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

    getProductById(id) {
        this.cargaProducts();
        const product = this.products.find(codeExist => codeExist.id === id);
        if (product) {
            return product
        } else {
            console.log("No se encontro el producto")
            return null;
        }

    }

    updateProduct(id, updated) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updated
            };
            this.guardarProducts();
            console.log('Se actualizo el producto', this.products[productIndex])
        } else {
            console.log('No se encontro el producto');
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            this.guardarProducts();
            console.log('Producto borrado: ', id);
        } else {
            console.log('No se encontro el producto');
        }
    }

}

const productManager = new ProductManager('./index.json');

console.log("Lista de productos al inicio", productManager.getProducts());

productManager.addProducts(
    "Sieger Criadores por 20 kg",
    "Alimento balanceado para mascotas",
    "10000",
    "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-All-In-One-Criadores.png",
    "1",
    30
);

productManager.addProducts(
    "Sieger Adult Medium & Large por 15 kg",
    "Alimento balanceado para mascotas",
    "5000",
    "https://sieger.com.ar/wp-content/uploads/2022/09/adult-medium-and-large.png",
    "2",
    10,
);

productManager.addProducts(
    "Sieger Puppy Medium & Large por 15 kg",
    "Alimento balanceado para mascotas",
    "8000",
    "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Puppy-Medium-Large.png",
    "3",
    20,
);

console.log("Lista de productos despues de agregar: ", productManager.products);

const productById = productManager.getProductById(2);
if (productById) {
    console.log("Producto encontrado")
} else {
    console.log("Producto no encontrado");
}

productManager.updateProduct(3, {
    title: "Actualizado",
    price: 100000
});

productManager.deleteProduct(1);
console.log("Lista final", productManager.products);
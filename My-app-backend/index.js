class ProductManager {
    constructor() {
        this.products = [];
        this.uniqueId = 1;
    }

    getProducts() {
        return this.products;
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
        this.products.push({ id, title, description, price, thumbnail, code, stock });
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new Error("Not Found");
        }
        return product;
    }

    generarId() {
        const id = this.uniqueId;
        this.uniqueId++
        return id;
    };

}

const productManager = new ProductManager();

console.log(productManager.getProducts());

const newProduct = {
    title: "Sieger Criadores por 20 kg",
    description: "Alimento balanceado para mascotas",
    price: "10000",
    thumbnail: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-All-In-One-Criadores.png",
    code: "1",
    stock: 30,
};
productManager.addProducts(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock);

console.log(productManager.getProducts());

try {
    productManager.addProducts(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock);
} catch (error) {
    console.error(error.message);
}

const foundProduct = productManager.getProductById(1);

try {
    productManager.getProductById(100);
} catch (error) {
    console.error(error.message);
}
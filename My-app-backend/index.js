class ProductManager {
    constructor() {
        this.products = [];
        this.uniqueId = 1;
    }

    getProducts() {
        return this.products;
    }

    addProducts(product) {
        if (this.products.some(prod => prod.code === product.code)) {
            throw new Error("Producto repetido");
        }
        const id = this.generarId();
        this.products.push({ id, ...product });
    }

    getProductById(id) {
        const product = this.products.find(prod => prod.id === id);
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
productManager.addProducts(newProduct);

console.log(productManager.getProducts());

try{
    productManager.addProducts(newProduct);
} catch (error){
    console.error(error.message);
}

const foundProduct = productManager.getProductById(1);

try{
    productManager.getProductById(100);
}catch(error){
    console.error(error.message);
}
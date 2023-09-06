import express from 'express';
import fs from "fs/promises";
import { productRouter } from './routes/product.js';
import { cartsRouter } from './routes/carts.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);

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

const productManager = new ProductManager('src/products.json')
const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();
        if (isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
});

productsRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await productManager.getProductById(id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }

});

productsRouter.post('/', (req, res) => {
    const { title, description, price, thumbnail, code, stock } = req.body;
    productManager.addProducts(title, description, price, thumbnail, code, stock);
    res.status(200).json({ message: 'Producto creado' });
});

productsRouter.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const updated = req.body;
    const updatedProduct = await productManager.updateProduct(id, updated);

    if (updatedProduct) {
        res.json({ message: 'Producto actualizado' })
    } else {
        res.status(404).json({ error: 'Producto no encontrado' })
    }
});

productsRouter.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await productManager.deleteProduct(id);
    if (deleted) {
        res.json({ message: 'Producto eliminado' });
    } else {
        res.status(404).json({ error: 'Producto no encontrado' })
    }
});

app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto 8080')
});




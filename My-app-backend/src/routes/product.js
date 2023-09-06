import express from 'express';
import fs from "fs/promises";
const productRouter = express.Router();


async function loadProducts() {
    try {

        const data = await fs.readFile('src/products.json', 'utf-8');
        return JSON.parse(data)

    } catch (error) {
        console.error('Error al cargar:', error);
        return [];
    }

};

async function saveProducts(products) {
    try {
        await fs.writeFile('src/products.json', JSON.stringify(products, null, 6), 'utf-8');
    } catch (error) {
        console.error('Error al guardar:', error)
    }
}

productRouter.get('/', async (req, res) => {

    try {
        const limit = parseInt(req.query.limit);
        const products = await loadProducts();

        if (isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
});

productRouter.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    const products = await loadProducts();
    const product = products.find(product => product.id === id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }

});

productRouter.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const updated = req.body;
    const products = await loadProducts();
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex!==-1){
        products[productIndex]={...products[productIndex],...updated}    
        saveProducts(products);
        res.json({message:'Se actualizo el producto'})
    }else{
        res.status(404).json({error:'Producto no encontrado'});
    }
});

productRouter.delete('/:pid',async(req,res)=>{
    const id = parseInt(req.params.pid);
    const products = await loadProducts();
    const productIndex = products.findIndex(product=>product.id===id);

    if(productIndex !== -1){
        products.splice(productIndex,1);
        saveProducts(products);
        res.json({message:'Producto eliminado'});
    }else{
        res.status(404).json({error:'Producto no encontrado'});
    }

})





export { productRouter as productRouter };


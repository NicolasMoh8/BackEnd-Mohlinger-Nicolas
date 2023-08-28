import express from 'express';


const app = express();
const products = [
    { id: '1', nombre: "Sieger Criadores por 20 kg", Tipo: "Alimento balanceado para mascotas", Precio: "10000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-All-In-One-Criadores.png", stock: 30 },
    { id: '2', nombre: "Sieger Adult Medium & Large Breed por 15 kg", Tipo: "Alimento balanceado para mascotas", Precio: "5000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/adult-medium-and-large.png", stock: 10 },
    { id: '3', nombre: "Sieger Puppy Medium & Large Breed por 15 kg", Tipo: "Alimento balanceado para mascotas", Precio: "8000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Puppy-Medium-Large.png", stock: 20 },
    { id: '4', nombre: "Sieger Katze Adult por 7,5 kg", Tipo: "Alimento balanceado para mascotas", Precio: "4500", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Katze-Adult-1.png", stock: 5 },
    { id: '5', nombre: "Sieger Katze Urinary por 7,5 kg", Tipo: "Alimento balanceado para mascotas", Precio: "5000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Katze-Urinary-1.png", stock: 8 },
    { id: '6', nombre: "Sieger Katze Kitten por 7,5 kg", Tipo: "Alimento balanceado para mascotas", Precio: "5000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Katze-Kitten-1.png", stock: 15 },
    { id: '7', nombre: "Sieger Senior Medium & Large Breed por 15 kg", Tipo: "Alimento balanceado para mascotas", Precio: "7500", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Senior-Medium-Large.png", stock: 4 },
    { id: '8', nombre: "Sieger Senior Mini & Small Breed por 15 kg", Tipo: "Alimento balanceado para mascotas", Precio: "8000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Senior-Mini-Small.png", stock: 10 },
    { id: '9', nombre: "Sieger Dermaprotect por 12 kg", Tipo: "Alimento balanceado para mascotas", Precio: "1000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Dermaprotect.png", stock: 1 },
    { id: '10', nombre: "Sieger Reduced Calorie por 12 kg", Tipo: "Alimento balanceado para mascotas", Precio: "9000", Imagen: "https://sieger.com.ar/wp-content/uploads/2022/09/Sieger-Reduced-Calorie.png", stock: 17 },
]


app.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        if (isNaN(limit)) {
            res.json(products);
        } else {
            res.json(products.slice(0, limit));
        }

    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' })
    }
});

app.get('/products/:id', (req, res) => {
    const productId = req.params.id;
    const product = products.find(prod => prod.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }

});

const PORT = 8080;
app.listen(PORT, () => {
    console.log('Servidor corriendo en el puerto 8080')
});




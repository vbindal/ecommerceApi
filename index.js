const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// function to read file
function readData() {
    try {
        const data = fs.readFileSync('./data.json'); 
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        res.status(404).send("error while reading the data")
    }
}

// function to write file

function writeData(data) {
    try {
        fs.writeFileSync('./data.json', JSON.stringify(data));
    } catch (e) {
        console.error("Error Writing data", e);
    }
}

//default landing page

app.get('/', (req, res) => res.send("hello"));

// get all products

app.get('/products', (req, res) => {
    const products = readData();
    res.json(products);
});

// get product by id

app.get('/products/:id', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.json(product);
});

// creating new product

app.post('/products', (req, res) => {
    const products = readData();
    const newProduct = {
        id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    };
    // appending new product to the list
    products.push(newProduct); 

    // writing back the new list to file
    writeData(products); 
    res.status(201).json(newProduct);
});

// updating a product
app.put('/products/:id', (req, res) => {
    const products = readData();
    const product = products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).send('Product not found');
    }

    
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    writeData(products); 
    res.status(200).json(product);
});

// deleting a product
app.delete('/products/:id', (req, res) => {
    const products = readData();
    const newProducts = products.filter(p => p.id !== parseInt(req.params.id));

    if (newProducts.length === products.length) {
        return res.status(404).send('Product not found');
    }

    writeData(newProducts);
    res.status(204).send('Deleted the product');
});


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));

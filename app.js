const express = require('express');
const fs = require('fs');

class Products {
  constructor() {
    this.products = [];
    this.filePath = 'products.json';
    this.init();
    }

    init() {
    try {
    const data = fs.readFileSync(this.filePath, 'utf-8');
    this.products = JSON.parse(data);
    } catch (err) {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products));
    }
  }

    getAll() {
    return this.products;
    }

    getByID(id) {
    return this.products.find((product) => product.id === id);
    }

    add(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);
    this.save();
    return newProduct;
    }

    update(id, data) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    const product = this.products[index];
    const updatedProduct = { ...product, ...data };
    this.products[index] = updatedProduct;
    this.save();
    return updatedProduct;
    }

    delete(id) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) return null;
    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    this.save();
    return deletedProduct;
    }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products));
  }
}

const products = new Products();

const app = express();

app.get('/products', (req, res) => {
  const limit = parseInt(req.query.limit) || products.getAll().length;
  const allProducts = products.getAll().slice(0, limit);
  res.json(allProducts);
});
// Endpoint para obtener un producto por su ID
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.getByID(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});

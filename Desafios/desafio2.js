const fs = require("fs").promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.nextId = 1;
    return (async () => {
      await this.loadProducts();
      return this;
    })();
  }

  // Cargar productos desde el archivo
  loadProducts = async () => {
    try {
      const data = await fs.readFile(this.path);
      this.products = JSON.parse(data);
      this.nextId =
        this.products.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        ) + 1;
    } catch (error) {
      this.products = [];
    }
  };

  // Guardar productos en el archivo
  saveProducts = async () => {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, data);
    } catch (error) {
      console.error("Error al guardar productos:", error.message);
    }
  };

  // Agregar un nuevo producto
  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const product = {
      id: this.nextId++,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    await this.saveProducts();
    console.log(`Producto '${title}' agregado con éxito.`);
  };

  // Obtener todos los productos
  getProducts = () => this.products;

  // Obtener un producto por su ID
  getProductById = (id) => {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Producto no encontrado.");
    }

    return product;
  };

  // Actualizar un producto por su ID con nuevos campos
  updateProduct = async (id, updatedFields) => {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error("Producto no encontrado.");
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedFields };

    await this.saveProducts();
    console.log(`Producto con ID ${id} actualizado con éxito.`);
  };

  // Eliminar un producto por su ID
  deleteProduct = async (id) => {
    const index = this.products.findIndex((product) => product.id === id);

    if (index === -1) {
      console.error("Producto no encontrado.");
      return;
    }

    this.products.splice(index, 1);
    await this.saveProducts();
    console.log(`Producto con ID ${id} eliminado con éxito.`);
  };
}

// ========================== TESTING =========================================

Testing = (async () => {
  // Creamos una instancia de la clase "ProductManager" con un archivo específico
  const productManager = await new ProductManager("productos.json");

  // Mostramos los productos actuales (array vacío [])
  console.log(productManager.getProducts());

  // Agregamos un nuevo producto con algunos detalles
  await productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );

  // Mostramos los productos nuevamente, esta vez debería aparecer el nuevo producto
  console.log(productManager.getProducts());

  // Intentamos obtener el producto recién agregado por su ID
  try {
    const productById = productManager.getProductById(2);
    console.log("Producto encontrado por ID ", productById);
  } catch (error) {
    console.error(error.message);
  }

  // se actualiza el precio del producto recién agregado
  try {
    const updateProduct = productManager.getProducts()[0].id;
    await productManager.updateProduct(updateProduct, {
      price: 500,
    });
    console.log(
      "Producto actualizado:",
      productManager.getProductById(updateProduct)
    );
  } catch (error) {
    console.error(error.message);
  }

  // se elimina el producto
  try {
    await productManager.deleteProduct(3);
    console.log("Productos restantes:", productManager.getProducts());
  } catch (error) {
    console.error(error.message);
  }
})();

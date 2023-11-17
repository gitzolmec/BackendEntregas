class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1;
  }

  addProduct = (title, description, price, thumbnail, code, stock) => {
    //valida que todos los campos sean obligatorios
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.error("Todos los campos son obligatorios.");
      return;
    }

    //valida que el producto no este repetido
    if (this.products.some((product) => product.code === code)) {
      console.error(
        "El 'code'ingresado ya esta registrado para otro producto."
      );
      return;
    }

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
    console.log(`Producto '${title}' agregado con éxito.`);
  };

  //devuelve el array con todos los productos agregados
  getProducts = () => {
    return this.products;
  };

  //busca el producto que coincida con el id, si no lo encuentra devuelve un mensaje indicando "Producto no encontrado"
  getProductById = (id) => {
    const product = this.products.find((product) => product.id === id);

    if (!product) {
      console.error("Producto no encontrado.");
    }

    return product;
  };
}

//*****************Testing del Codigo*********************/

const productManager = new ProductManager();

// devuelve un arreglo vacío []
console.log(productManager.getProducts());

try {
  // Agrega un producto
  productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );

  // muestra el producto agregado
  console.log(productManager.getProducts());

  // al Intentar agregar un producto con el mismo código arroja error
  productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );
} catch (error) {
  // Captura los errores y los muestra
  console.error(error.message);
}

try {
  // busca producto por id no existente y arroja error
  const productById = productManager.getProductById(7);
  console.log(productById);
} catch (error) {
  // Captura los errores y los muestra
  console.error(error.message);
  console.log("error");
}

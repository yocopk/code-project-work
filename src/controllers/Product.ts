import { ModelProduct } from "../models/Product";

export class ControllerProduct {
  products: ModelProduct[] = [];

  private checkAdminRights(isAdmin: boolean): boolean {
    if (!isAdmin) {
      console.log("Access denied: Admin rights required.");
      return false;
    }
    return true;
  }

  createProduct(
    name: ModelProduct["name"],
    description: ModelProduct["description"],
    price: ModelProduct["price"],
    createdAt: ModelProduct["createdAt"],
    isAdmin: boolean
  ) {
    if (!this.checkAdminRights(isAdmin)) {
      return;
    }
    if (!name || !description || !price || !createdAt) {
      console.log("All fields are required!");
    } else {
      const newProduct = new ModelProduct(name, description, price, createdAt);
      this.products = [...this.products, newProduct];
      console.log("Product successfully created!");
    }
    return true;
  }

  readProducts() {
    return this.products;
  }

  readProductsById(idProduct: ModelProduct["idProduct"]) {
    return this.products.find((product) => product.idProduct === idProduct);
  }

  updateProduct(
    idProduct: ModelProduct["idProduct"],
    name: ModelProduct["name"],
    description: ModelProduct["description"],
    price: ModelProduct["price"],
    createdAt: ModelProduct["createdAt"],
    isAdmin: boolean
  ) {
    if (!this.checkAdminRights(isAdmin)) {
      return "Access denied!";
    }
    const existingProduct = this.products.find(
      (product) => product.idProduct === idProduct
    );
    if (!existingProduct) {
      return "Product not found!";
    }
    const updatedProductArray = this.products.map((product) => {
      if (product.idProduct === idProduct) {
        const updatedProduct = { ...product };
        if (name !== undefined) {
          updatedProduct.name = name;
        }
        if (description !== undefined) {
          updatedProduct.description = description;
        }
        if (price !== undefined) {
          updatedProduct.price = price;
        }
        if (createdAt !== undefined) {
          updatedProduct.createdAt = createdAt;
        }
        return updatedProduct;
      }
      return product;
    });
    this.products = updatedProductArray;
    console.log("Product successfully updated!");

    const updatedProduct = updatedProductArray.find(
      (product) => product.idProduct === idProduct
    );
    return updatedProduct || "Product not found!";
  }

  deleteProduct(idProduct: ModelProduct["idProduct"], isAdmin: boolean) {
    if (!this.checkAdminRights(isAdmin)) {
      return "Access denied!";
    }
    const productFound = this.products.find(
      (product) => product.idProduct === idProduct
    );
    if (!productFound) {
      console.log("Product not found!");
      return false;
    }
    this.products = this.products.filter(
      (product) => product.idProduct !== idProduct
    );
    console.log("Product successfully deleted!");
    return true;
  }
}

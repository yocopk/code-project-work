import { Router } from "express";
import { ControllerProduct } from "../controllers/Product";
import { authenticate, authorizeRole } from "../middlewares/auth";

const product = new ControllerProduct;
const productRoutes = Router();

productRoutes.post("/products", authenticate, authorizeRole, product.createProduct);
productRoutes.get("/products", product.readProducts);
productRoutes.get("/products/:idProduct", product.readProductsById);  
productRoutes.put("/products/:idProduct", authenticate, authorizeRole, product.updateProduct);
productRoutes.delete("/products/:idProduct", authenticate, authorizeRole, product.deleteProduct);

 export default productRoutes;
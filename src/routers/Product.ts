import { Router } from "express";
import { ControllerProduct } from "../controllers/Product";
import { authenticate, errorHandler, authorizeRole } from "../middlewares/auth";

const product = new ControllerProduct;
const productRoutes = Router();

productRoutes.post("/products", authenticate, authorizeRole("admin"), product.createProduct);
productRoutes.get("/products", product.readProducts);
productRoutes.get("/products/:idProduct", product.readProductsById);  
productRoutes.put("/products/:idProduct", authenticate, authorizeRole("admin"), product.updateProduct);
productRoutes.delete("/products/:idProduct", authenticate, authorizeRole("admin"), product.deleteProduct);

 export default productRoutes;
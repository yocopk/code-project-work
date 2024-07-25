import { Router } from "express";
import { ControllerProduct } from "../controllers/Product";
import { authenticate, errorHandler, authorizeRole } from "../middlewares/auth";

const product = new ControllerProduct;
const productRouter = Router();

productRouter.post("/", authenticate, authorizeRole("admin"), product.createProduct);
productRouter.get("/", product.readProducts);
productRouter.get("/:idProduct", product.readProductsById);  
productRouter.put("/:idProduct", authenticate, authorizeRole("admin"), product.updateProduct);
productRouter.delete("/:idProduct", authenticate, authorizeRole("admin"), product.deleteProduct);


 productRouter.use("/api/products", productRouter)

 export default productRouter;
import { Router } from "express";
import { authenticate, authorizeRole } from "../middlewares/auth";
import { ControllerCart } from "../controllers/Carts";

const cart = new ControllerCart();
const cartRoutes = Router();

cartRoutes.post("/cart/:productId", authenticate, cart.addProductToCart);
cartRoutes.get("/cart/:userId", cart.getCart);
cartRoutes.delete("/cart/:productId", authenticate, authorizeRole, cart.removeProductFromCart);
cartRoutes.delete("/cart", cart.clearCart);

export default cartRoutes;
import { Router } from "express";
import { ControllerCart } from "../controllers/Carts";

const cart = new ControllerCart();
const cartRoutes = Router();

cartRoutes.post("/cart/add/:id", cart.addProductToCart);
cartRoutes.get("/cart", cart.getCart);
cartRoutes.delete("/cart/remove/:id", cart.removeProductFromCart);
cartRoutes.delete("/cart/clear", cart.clearCart);

export default cartRoutes;
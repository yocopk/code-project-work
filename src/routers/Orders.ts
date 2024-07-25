import { Router } from "express";
import { ControllerOrders } from "../controllers/Orders";

const orders = new ControllerOrders();
const ordersRoutes = Router();

ordersRoutes.get("/orders", orders.getOrders);
ordersRoutes.post("/orders", orders.createOrder);
ordersRoutes.get("/orders/:idOrder", orders.getOrderById);
ordersRoutes.put("/orders/:idOrder", orders.updateOrderStatus);
ordersRoutes.delete("/orders/:idOrder", orders.deleteOrder);

export default ordersRoutes;
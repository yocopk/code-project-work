import { Router } from "express";
import { ControllerOrders } from "../controllers/Orders";
import { authenticate, authorizeRole } from "../middlewares/auth";

const orders = new ControllerOrders();
const ordersRoutes = Router();

ordersRoutes.get("/orders/:userId", authenticate, orders.getOrders);
ordersRoutes.post("/orders", authenticate, orders.createOrder);
ordersRoutes.get("/orders/:orderId", authenticate, orders.getOrderById);
ordersRoutes.put("/orders/:orderId", authenticate, orders.updateOrderStatus);
ordersRoutes.delete("/orders/:orderId", authenticate, orders.deleteOrder);

export default ordersRoutes;
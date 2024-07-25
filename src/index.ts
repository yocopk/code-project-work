// #region //imports
import express, { Request, Response } from "express";
import { createServer } from "http";
import { config } from "dotenv";
import { createClient } from "@vercel/postgres";
import { ControllerProduct } from "./controllers/Product";
import { authenticate, errorHandler, authorizeRole } from "./middlewares/auth";
import { ControllerOrders } from "./controllers/Orders";

import pool from "./middlewares/db";
import { verify } from "jsonwebtoken";

// #endregion

// #region //config
config();

const app = express();
app.use(express.json());
const port = process.env.port || 3000;
const server = createServer(app);

const client = createClient({
  connectionString: process.env.DATABASE_URL,
});
client.connect();

(async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
})();

// #endregion

const controllerProduct = new ControllerProduct();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/products", authenticate, authorizeRole("admin"), (req, res) =>
  controllerProduct.createProduct(req, res)
);

app.get("/api/products", (req, res) =>
  controllerProduct.readProducts(req, res)
);

app.get("/api/products/:idProduct", (req, res) =>
  controllerProduct.readProductsById(req, res)
);

app.put(
  "/api/products/:idProduct",
  authenticate,
  authorizeRole("admin"),
  (req, res) => controllerProduct.updateProduct(req, res)
);

app.delete(
  "/api/products/:idProduct",
  authenticate,
  authorizeRole("admin"),
  (req, res) => controllerProduct.deleteProduct(req, res)
);

app.get("/api/cart", function (req: Request, res: Response) {
  client.query("SELECT * FROM carts", function (error, response) {
    if (error) res.status(400).json({ error });
    else res.status(200).json(response.rows);
  });
});

app.post("/api/cart/add/:id", function (req: Request, res: Response) {
  const idProduct = req.params.id;
  const idUser = req.body.idUser;
  client.query(
    "INSERT INTO carts (user, product) VALUES ($1, $2)",
    [idUser, idProduct],
    function (error, response) {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(201).json({ message: "Product added to cart successfully" });
      }
    }
  );
});

app.delete("/api/cart/remove/:idCart", function (req: Request, res: Response) {
  client.query(
    "DELETE FROM carts WHERE id = $1",
    [req.params.idCart],
    function (error, response) {
      if (error) res.status(400).json({ error });
    }
  );
});

app.delete("/api/cart/clear", function (req: Request, res: Response) {
  client.query("DELETE * FROM carts", function (error, response) {
    if (error) {
      res.status(400).json({ error });
    } else {
      res.status(200).json({ message: "Cart emptied successfully" });
    }
  });
});

const controllerOrders = new ControllerOrders();

app.get("/api/orders", authenticate, (req, res) =>
  controllerOrders.getOrders(req, res)
);

app.post("/api/orders", authenticate, authorizeRole("admin"), (req, res) =>
  controllerOrders.createOrder(req, res)
);

app.get("/api/orders/:idOrder", authenticate, (req, res) =>
  controllerOrders.getOrderById(req, res)
);

app.put(
  "/api/orders/:idOrder",
  authenticate,
  authorizeRole("admin"),
  (req, res) => controllerOrders.updateOrderStatus(req, res)
);

app.delete(
  "/api/orders/:idOrder",
  authenticate,
  authorizeRole("admin"),
  (req, res) => controllerOrders.deleteOrder(req, res)
);

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

export default pool;

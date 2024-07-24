import express, { Request, Response } from "express";

import { createServer } from "http";
import { config } from "dotenv";

import { createClient } from "@vercel/postgres";

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

app.use(express.json);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/products", (req: Request, res: Response) => {
  const { name, description, price, createdAt } = req.body;
  client.query(
    `INSERT INTO products (name, description, price, created_at) VALUES ($1, $2, $3, $4)`,
    [name, description, price, createdAt],
    (error, response) => {
      if (error) res.status(500).send({ error });
      else res.status(201).send({ product: "succesfully created" });
    }
  );
});

app.get("/api/products", function (req: Request, res: Response) {
  client.query("SELECT * FROM products", function (error, response) {
    if (error) res.status(400).json({ error });
    else res.status(200).json(response.rows);
  });
});

app.get("/api/products/:idProduct", function (req: Request, res: Response) {
  client.query(
    "SELECT * FROM products WHERE id = $1",
    [req.params.idProduct],
    function (error, response) {
      if (error) res.status(400).json({ error });
    }
  );
});

app.put("/api/products/:idProduct", function (req: Request, res: Response) {
  client.query(
    "UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4",
    [req.body.name, req.body.description, req.body.price, req.params.idProduct],
    function (error, response) {
      if (error) res.status(400).json({ error });
    }
  );
});

app.delete("/api/products/:idProduct", function (req: Request, res: Response) {
  client.query(
    "DELETE FROM products WHERE id = $1",
    [req.params.idProduct],
    function (error, response) {
      if (error) res.status(400).json({ error });
    }
  );
});

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

server.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});

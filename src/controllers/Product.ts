import { Request, Response } from "express";
import { ModelProduct } from "../models/Product";
import pool from "../config/db";

export class ControllerProduct {

  async createProduct(req: Request, res: Response) {
    const client = await  pool.connect();
    const { name, description, price} = req.body;
    if (!name || !description || !price) {
      return res.status(400).send("All fields are required!");
    }
    try {
      const query =
        "INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *";
      const values = [name, description, price];
      const result = await client.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not created!");
    }
    finally { 
      client.release()
    }
  }
  async readProducts(req: Request, res: Response) {
    const client = await pool.connect();
        try {
      const query = "SELECT * FROM products";
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not found!");
    }    
    finally { 
      client.release()
    }
  }

  async readProductsById(req: Request, res: Response) {
    const client = await pool.connect();

    const idProduct = req.params.idProduct;
    try {
      const query = "SELECT * FROM products WHERE id = $1";
      const values = [idProduct];
      const result = await client.query(query, values);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not found!");
    }
     finally { 
      client.release()
    }
  }
  async updateProduct(req: Request, res: Response) {
    const client = await pool.connect();

    const idProduct = req.params.idProduct;
    const { name, description, price} = req.body;
    if (!name || !description || !price) {
      return res.status(400).send("All fields are required!");
    }
    try {
      const query =
        "UPDATE products SET name = $1, description = $2, price = $3, WHERE id = $4 RETURNING *";
      const values = [name, description, price, idProduct];
      const result = await client.query(query, values);
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not updated!");
    }    
    finally { 
      client.release()
    }
  }

  async deleteProduct(req: Request, res: Response) {
    const client = await pool.connect();

    const idProduct = req.params.idProduct;
    if (!idProduct) {
      return res.status(400).send("All fields are required!");
    }
    try {
      const query = "DELETE FROM products WHERE id = $1 RETURNING *";
      const values = [idProduct];
      const result = await client.query(query, values);
      res.status(200).send({ message: "Product deleted successfully!", product: result.rows[0] });
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not deleted!");
    }    
    finally { 
      client.release()
    }
  }
}

import pool from "../config/db";
import { Response, Request } from "express";

export class ControllerCart {


  async addProductToCart(req: Request, res: Response) {
  const client = await pool.connect();
  const { productId } = req.params;
  const { userId } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  try { 
    const query = "INSERT INTO carts (user_id, product_id) VALUES ($1, $2) RETURNING *";
    const result = await client.query(query, [userId, productId]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add product to cart" });
  }
  finally { 
    client.release();
  }
  }
  
  
  async getCart(req: Request, res: Response ){
    const client = await pool.connect();
    const { userId } = req.params;
    try {
    const query = "SELECT * FROM carts WHERE user_id = $1";
    const result = await client.query(query, [userId]);
    res.status(200).json(result.rows); 
  } catch (error) {
    res.status(500).json({ error: "Failed to get cart" });
  } finally {
    client.release();
  }

  }

  async removeProductFromCart(req: Request, res: Response) {
  const client = await pool.connect();
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ error: "Missing required parameters" });  
  }
  try {
    const query = "DELETE FROM carts WHERE product_id = $1";
    const result = await client.query(query, [productId]);
    res.status(200).json({ message: "Product removed from cart successfully", item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product from cart", error });
  } finally {
    client.release();
  }
  }

  async clearCart(req: Request, res: Response) {
const client = await pool.connect();
const { userId } = req.body;
if (!userId) {
  return res.status(400).json({ error: "Missing required parameters" });
}
try {
  const query = "DELETE * FROM carts WHERE user_id = $1";
  const result = await client.query(query, [userId]);
  res.status(200).json({ message: "Cart cleared successfully" });
} catch (error) {
  res.status(500).json({ error: "Failed to clear cart" });
} finally {
  client.release();
    } } }

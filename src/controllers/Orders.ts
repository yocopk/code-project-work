import { Request, Response } from "express";
import { ModelOrder } from "../models/Order";
import pool from "../middlewares/db";

export class ControllerOrders {
  async getOrders(req: Request, res: Response) {
    const client = await pool.connect();
    const reference = req.params.referenceKeyUser;
    try {
      const query =
        "SELECT * FROM orders WHERE referenceKeyUser = $referenceKeyUser";
      const result = await client.query(query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error executing query:", error);
      res.status(500).send("Product not found!");
    }
  }

  async createOrder(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const {
        referenceKeyUser,
        name,
        surname,
        address,
        postalCode,
        city,
        region,
        country,
        cartItems,
      } = req.body;

      const insertOrderQuery = `INSERT INTO orders (referenceKeyUser, name, surname, address, postalCode, city, region, country, data_order)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
        RETURNING order_id`;
      const orderResult = await client.query(insertOrderQuery, [
        referenceKeyUser,
        name,
        surname,
        address,
        postalCode,
        city,
        region,
        country,
      ]);
      const orderId = orderResult.rows[0].order_id;

      for (const item of cartItems) {
        const insertItemQuery = `INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES ($1, $2, $3, $4)`;
        await client.query(insertItemQuery, [
          orderId,
          item.productId,
          item.quantity,
          item.price,
        ]);
      }

      await client.query("COMMIT");

      res.status(201).json({ message: "Ordine creato con successo", orderId });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Errore durante la creazione dell'ordine:", error);
      res
        .status(500)
        .json({ error: "Errore durante la creazione dell'ordine" });
    } finally {
      client.release();
    }
  }

  async getOrderById(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const orderId = req.params.orderId;
      const query = `SELECT * FROM orders WHERE order_Id = $1`;
      const result = await client.query(query, [orderId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Ordine non trovato" });
      }
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Errore nell'esecuzione della query:", error);
      res.status(500).json({ message: "Errore nel recupero dell'ordine" });
    } finally {
      client.release();
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const orderId = req.params.orderId;
      const { newStatus } = req.body;

      const query = `UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING * `;
      const result = await client.query(query, [newStatus, orderId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Ordine non trovato" });
      }
      await client.query("COMMIT");
      res.status(200).json({
        message: "Stato dell'ordine aggiornato con successo",
        order: result.rows[0],
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(
        "Errore nell'aggiornamento dello stato dell'ordine:",
        error
      );
      res
        .status(500)
        .json({ message: "Errore nell'aggiornamento dello stato dell'ordine" });
    } finally {
      client.release();
    }
  }

  async deleteOrder(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      const orderId = req.params.orderId;
      const deletedStatus = "cancellato";
      const query = `UPDATE orders SET status = $1 WHERE order_id = $2 AND status != $1 RETURNING *`;
      const result = await client.query(query, [deletedStatus, orderId]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Ordine non trovato o già cancellato" });
      }
      res.status(200).json({
        message: "Ordine cancellato con successo",
        order: result.rows[0],
      });
    } catch (error) {
      console.error("Errore nella cancellazione dell'ordine:", error);
      res
        .status(500)
        .json({ message: "Errore nella cancellazione dell'ordine" });
    } finally {
      client.release();
    }
  }
}

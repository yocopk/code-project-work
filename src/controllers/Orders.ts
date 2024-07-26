import { Request, Response } from "express";
import { ModelOrder } from "../models/Order";
import pool from "../config/db";

export class ControllerOrders {
  async getOrders(req: Request, res: Response) {
    const userId = req.params.userId; // Supponendo che l'ID dell'utente sia passato come parametro della richiesta
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await client.query("SELECT * FROM orders WHERE user_id = $1", [userId]);
        await client.query("COMMIT");
        res.status(200).json(result.rows); // Restituisce i risultati correttamente
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Errore durante la richiesta degli ordini:", error);
        res.status(500).json({ message: "Errore durante la richiesta degli ordini" });
    } finally {
        client.release();
    }
}


  async createOrder(req: Request, res: Response) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const {
        referenceKeyUser,
        referenceKeyCart
      } = req.body;

      const newOrder = new ModelOrder(referenceKeyUser, referenceKeyCart);

      const insertOrderQuery = `INSERT INTO orders (user_id, cart_id, status) VALUES ($1, $2, $3)`;
      const orderResult = await client.query(insertOrderQuery, [
        newOrder.referenceKeyUser,
        newOrder.referenceKeyCart,
        newOrder.status
      ]);

      await client.query("COMMIT");
      res.status(200).json({
        message: "Ordine creato con successo"
      });
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Errore durante la creazione dell'ordine:", error);
      res.status(500).json({ message: "Errore durante la creazione dell'ordine" });
    } finally {
      client.release();
    }  
  }

  async getOrderById(req: Request, res: Response) {
    const client = await pool.connect();
    try {
        const orderId = req.params.orderId;

        // Log del parametro passato
        console.log("Order ID passato:", orderId);

        const query = `SELECT * FROM orders WHERE id = $1`;
        const result = await client.query(query, [orderId]);

        // Log dei risultati della query
        console.log("Risultati della query:", result.rows);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Ordine non trovato" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Errore nel recupero dell'ordine:", error);
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

      const query = `UPDATE orders SET status = $1 WHERE id = $2`;
      const result = await client.query(query, [newStatus, orderId]);
      if (result.rowCount === 0) {
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
      const query = `UPDATE orders SET status = $1 WHERE id = $2 AND status != $1 RETURNING *`;
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

import { ModelCart } from "../models/Cart";
import { Pool } from "pg";

export class CartController {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      // Configura qui i dettagli della connessione al tuo database
      user: "username",
      host: "localhost",
      database: "database_name",
      password: "password",
      port: 5432,
    });
  }

  async getCartByUser(referenceKeyUser: string): Promise<ModelCart[]> {
    const query = "SELECT * FROM carts WHERE reference_key_user = $1";
    const result = await this.pool.query(query, [referenceKeyUser]);
    return result.rows.map(
      (row) => new ModelCart(row.reference_key_user, row.reference_key_product)
    );
  }

  async addProductToCart(
    referenceKeyUser: string,
    referenceKeyProduct: string
  ): Promise<ModelCart> {
    const query =
      "INSERT INTO carts (user, product) VALUES ($1, $2) RETURNING *";
    const result = await this.pool.query(query, [
      referenceKeyUser,
      referenceKeyProduct,
    ]);
    const newCart = new ModelCart(result.rows[0].user, result.rows[0].product);
    newCart.primaryKey = result.rows[0].id;
    return newCart;
  }

  async removeProductFromCart(
    referenceKeyUser: string,
    primaryKey: number
  ): Promise<boolean> {
    const query = "DELETE FROM carts WHERE user = $1 AND id = $2";
    const result = await this.pool.query(query, [referenceKeyUser, primaryKey]);
    return result.rowCount != null && result.rowCount > 0;
  }

  async clearCartByUser(referenceKeyUser: string): Promise<boolean> {
    const query = "DELETE FROM carts WHERE user = $1";
    const result = await this.pool.query(query, [referenceKeyUser]);
    return result.rowCount != null && result.rowCount > 0;
  }
}

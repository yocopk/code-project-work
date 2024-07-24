import { ModelCart } from "../models/Cart";

export class CartController {
  private carts: ModelCart[] = [];

  getCartByUser(referenceKeyUser: string): ModelCart[] {
    return this.carts.filter(
      (cart) => cart.referenceKeyUser === referenceKeyUser
    );
  }

  addProductToCart(
    referenceKeyUser: string,
    referenceKeyProduct: string
  ): ModelCart {
    const newCart = new ModelCart(referenceKeyUser, referenceKeyProduct);
    this.carts = [...this.carts, newCart];
    return newCart;
  }
  removeProductFromCart(referenceKeyUser: string, primaryKey: number) {
    const index = this.carts.findIndex(
      (cart) =>
        cart.referenceKeyUser === referenceKeyUser &&
        cart.primaryKey === primaryKey
    );
    if (index === -1) {
      return false;
    }
    this.carts.splice(index, 1);
    return true;
  }

  clearCartByUser(referenceKeyUser: string) {
    const initialLength = this.carts.length;
    this.carts = this.carts.filter(
      (cart) => cart.referenceKeyUser !== referenceKeyUser
    );
    return this.carts.length !== initialLength;
  }
}

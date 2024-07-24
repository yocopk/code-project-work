import { ModelOrder } from "../models/Order";

export class ControllerOrders {
  orders: ModelOrder[] = [];
  referenceKeyCart: Array<ModelCart> = [];
  saveOrderChanges;

  getOrders(referenceKeyCart: string) {
    const ordersFound = this.referenceKeyCart.find(function (orders) {
      if (orders.referenceKeyCart === referenceKeyCart) return true;
      else return false;
    });

    if (!!ordersFound) return ordersFound;
    else return null;
  }

  createOrder(referenceKeyUser: string, referenceKeyCart: string) {
    const newOrder = new ModelOrder(referenceKeyUser, referenceKeyCart);
  }

  getOrderDetail(primaryKey: ModelOrder["primaryKey"]) {
    const detail = this.orders.find(function (order) {
      if (order.primaryKey === primaryKey) return true;
      else return false;
    });
    return detail;
  }

  updateOrderId(
    referenceKeyCart: string,
    referenceKeyUser: string,
    status: string
  ) {
    if (!referenceKeyUser) return false;
    else {
      const orderDetail = this.getOrderDetail(referenceKeyCart);
      if (!orderDetail) {
        console.log("Ordine non trovato");
        return false;
      }

      orderDetail.status = status;
      const saveSuccessfull = this.saveOrderChanges(orderDetail);
      return saveSuccessfull;
    }
  }

  deleteOrderId(order: string, referenceKeyUser: string) {
    if (!referenceKeyUser)
      console.log("Accesso non valido - ReferenceKeyUser mancante");
    return false;
  }
}

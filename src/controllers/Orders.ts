import { ModelOrder } from "../models/Order";

export class ControllerOrders {
  orders: ModelOrder[] = [];
  referenceKeyCart: Array<ModelCart> = [];

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

  updateOrdersId(
    referenceKeyCart: string,
    referenceKeyUser: string,
    status: string
  ) {
    if (!referenceKeyUser) return false;
    else {
      const updateStatusOrderByAdmin = this.getOrderDetail;
    }
  }

  deleteOrdersId() {}
}

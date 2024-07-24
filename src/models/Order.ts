export class ModelOrder {
  primaryKey: string;
  referenceKeyUser: string;
  referenceKeyCart: string;
  status: string;

  constructor(referenceKeyUser: string, referenceKeyCart: string) {
    // TODO
    this.primaryKey = Math.random().toString(36).slice(2);
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyCart = referenceKeyCart;
    this.status = "pending";
  }
}

    primaryKey: string;
    referenceKeyUser: string;
    referenceKeyProduct: string;
    status: string;
    constructor(referenceKeyUser: string, referenceKeyProduct: string) {
        this.primaryKey = Math.random().toString(36).slice(2);
        this.referenceKeyUser = referenceKeyUser;
        this.referenceKeyProduct = referenceKeyProduct;
        this.status = 'pending';
    }
}

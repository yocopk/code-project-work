export class ModelCart {
  primaryKey: number;
  referenceKeyUser: string;
  referenceKeyProduct: string;

  constructor(referenceKeyUser: string, referenceKeyProduct: string) {
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyProduct = referenceKeyProduct;
  }
}

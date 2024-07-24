import { ModelUser } from "./User";
import { ModelProduct } from "./Product";
import { v4 as uuidv4 } from 'uuid';
export class ModelCart {
  primaryKey: string;
  referenceKeyUser: ModelUser["primaryKey"];
  referenceKeyProduct: ModelProduct["primaryKey"];

  constructor(referenceKeyUser: string, referenceKeyProduct: string) {
    this.primaryKey = uuidv4();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyProduct = referenceKeyProduct;
  }
}

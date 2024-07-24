import { ModelUser } from "./User";
import { ModelProduct } from "./Product";
import {v4 as uuidv4} from 'uuid';
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

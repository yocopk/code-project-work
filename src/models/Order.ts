import { ModelCart } from "./Cart";
import { ModelUser } from "./User";
import { v4 as uuidv4 } from "uuid";
export class ModelOrder {
  primaryKey: string;
  referenceKeyUser: ModelUser["primaryKey"];
  referenceKeyCart: ModelCart["primaryKey"];
  status: string;

  constructor(referenceKeyUser: string, referenceKeyCart: string) {
    this.primaryKey = uuidv4();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyCart = referenceKeyCart;
    this.status = "pending";
  }
}

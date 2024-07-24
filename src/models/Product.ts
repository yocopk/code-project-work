export class ModelProduct {
  primaryKey: string;
  name: string;
  description: string;
  price: number;
  createdAt: Date;

  constructor(
    name: string,
    description: string,
    price: number,
    createdAt: Date
  ) {
    this.primaryKey = Math.random().toString(16).slice(2);
    this.name = name;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;

    this.validate();
  }

  private validate() {
    if (this.name.length === 0) {
      throw new Error("Name cannot be empty");
    }
    if (this.price < 0) {
      throw new Error("Price cannot be negative");
    }
  }
}

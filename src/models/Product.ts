export class ModelProduct {
  idProduct: string;
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
    this.idProduct = Math.random().toString(16).slice(2);
    this.name = name;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;
  }
}

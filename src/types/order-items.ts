import { Product } from '../models/Product';

export class OrderItems {
  [key: string]: {
    product: Product; quantity: number
  }
}

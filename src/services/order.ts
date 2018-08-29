import { Connection, ObjectID } from 'typeorm';
import { DatabaseProvider } from '../database/database';
import { Order } from '../models';
import { InnerResponse, OrderItems } from '../types';
import { productService } from './product';

export class OrderService {

  public async getById(id: string): Promise<InnerResponse> {
    console.log(`Getting order with id: ${id}`);

    if (!id || id.length < 1) {
      return new InnerResponse(404, { error: `Could not find an order with id ${id}`});
    }

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const order: Order = await connection.mongoManager.findOne(Order, id);

      if (!order) {
        return new InnerResponse(404, { error: `Could not find an order with id ${id}`});
      }

      return new InnerResponse(200, { order });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async create(order: Order): Promise<InnerResponse> {
    console.log('Creating new order');
    const ordr: Order = new Order();
    Object.assign(ordr, order);
    const products: OrderItems = order.items;

    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      const promises: Array<Promise<InnerResponse>> = [];

      Object.keys(products).forEach((key: string) => {
        console.log(`decreasing stock of a product with id ${key}`);
        products[key].product.stock -= products[key].quantity;
        promises.push(productService.update(products[key].product, new ObjectID(key)));
      });

      await Promise.all(promises);

      const created: Order = await connection.mongoManager.save(Order, ordr);

      return new InnerResponse(200, { order: created });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }

  }

  public async list(): Promise<InnerResponse> {
    console.log('Returning list of orders');
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const orders: Order[] = await connection.mongoManager.find(Order, {});

      return new InnerResponse(200, { orders });
    }
    catch (error) {
      return new InnerResponse(400, { error: 'Something went wrong' });
    }
  }

  public async update(prevOrder: Order, id: ObjectID): Promise<InnerResponse> {
    console.log(`Updating an order with id ${id}`);

    if (!id) {
      return new InnerResponse(404, { error: `Order with id:${id} does not exist and can not be updated` });
    }

    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      const existingOrder: Order = await connection.mongoManager.findOne(Order, id);

      if (!existingOrder) {
        return new InnerResponse(404, { error: `Order with id:${id} does not exist and can not be updated` });
      }

      Object.assign(existingOrder, prevOrder);

      await connection.mongoManager.findOneAndUpdate(Order,
        { _id: existingOrder.id },
        existingOrder,
        {upsert: false});

      return new InnerResponse(200, undefined);
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async delete(id: ObjectID): Promise<InnerResponse> {
    console.log(`Deleting an order with id ${id}`);
    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      await connection.mongoManager.delete(Order, id);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

}

export const orderService: OrderService = new OrderService();

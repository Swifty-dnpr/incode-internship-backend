import { Connection, FindOptions } from 'typeorm';
import { DatabaseProvider } from '../database/database';
import { Wishlist, Product } from '../models';
import { InnerResponse } from '../types';

export class WishlistService {

  public async getById(id: string): Promise<InnerResponse> {
    console.log(`Getting wishlist  of client with id: ${id}`);

    if (!id) {
      return new InnerResponse(404, { error: `Could not find an wishlist of client with id ${id}`});
    }

    try {
      const query: { [key: string]: string } = { 'client.id': id };
      const connection: Connection = await DatabaseProvider.getConnection();
      const wishlist: Wishlist = await connection.mongoManager.findOne(Wishlist, query as FindOptions<Wishlist>);

      if (!wishlist) {
        return new InnerResponse(404, { error: `Could not find an wishlist with id ${id}`});
      }

      return new InnerResponse(200, { wishlist });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async create(wishlist: Wishlist): Promise<InnerResponse> {
    console.log('Creating new wishlist');
    const wshlist: Wishlist = new Wishlist();
    Object.assign(wshlist, wishlist);

    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      const created: Wishlist = await connection.mongoManager.save(Wishlist, wshlist);

      return new InnerResponse(200, { wishlist: created });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }

  }

  public async list(): Promise<InnerResponse> {
    console.log('Returning list of wishlists');
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const wishlists: Wishlist[] = await connection.mongoManager.find(Wishlist, {});

      return new InnerResponse(200, { wishlists });
    }
    catch (error) {
      return new InnerResponse(400, { error: 'Something went wrong' });
    }
  }

  public async update(prevWishlist: Wishlist, id: string): Promise<InnerResponse> {
    console.log(`Updating an wishlist of a user with id ${id}`);

    if (!id) {
      return new InnerResponse(404, { error: `Wishlist of a user with id:${id} does not exist and can not be updated` });
    }

    try {
      const query: { [key: string]: string } = { 'client.id': id };
      const connection: Connection = await DatabaseProvider.getConnection();

      const existingWishlist: Wishlist = await connection.mongoManager.findOne(Wishlist, query);

      if (!existingWishlist) {
        return new InnerResponse(404, { error: `Wishlist of a user with id:${id} does not exist and can not be updated` });
      }

      Object.assign(existingWishlist, prevWishlist);

      await connection.mongoManager.findOneAndUpdate(Wishlist,
        query,
        existingWishlist,
        {upsert: false});

      return new InnerResponse(200, undefined);
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async delete(id: string): Promise<InnerResponse> {
    console.log(`Deleting an wishlist with id ${id}`);
    try {
      const query: { [key: string]: string } = { 'client.id': id };
      const connection: Connection = await DatabaseProvider.getConnection();

      await connection.mongoManager.delete(Wishlist, query);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

}

export const wishlistService: WishlistService = new WishlistService();

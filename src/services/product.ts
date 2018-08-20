import { DatabaseProvider } from "../database/database";
import { Product, Category } from "../models";
import { categoryService } from './category';
import { ObjectId } from 'mongodb';
import { ObjectID } from 'typeorm';

export class ProductService {
  public async getById(id: string): Promise<Product> {
    console.log(`Getting product with id: ${id}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      return await connection.mongoManager.findOne(Product, id);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getByCategory(category_title: string): Promise<Product[]> {
    console.log(`Getting products of category: ${category_title}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      return await connection.mongoManager.find(Product, { category_title });
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(product: Product): Promise<Product> {
    console.log('Creating new product')
    const prdct = new Product();
    Object.assign(prdct, product);

    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager;
    try {
      const category = await categoryService.getByTitle(prdct.category_title);

      if (category && category.id) {
        prdct.category_id = category.id;
      }

      return await manager.save(prdct);
    } catch (err) {
      throw new Error(err);
    }
    
  }

  public async list(): Promise<Product[]> {
    console.log('Returning list of products');
    const connection = await DatabaseProvider.getConnection();
    return await connection.mongoManager.find(Product);
  }

  public async update(product: Product, id: string): Promise<Object> {
     console.log(`Updating a product with id ${id}`);
     const connection = await DatabaseProvider.getConnection();
     const manager = connection.mongoManager; 
     const _id = new ObjectId(id);
      try {
        return await manager.findOneAndUpdate(Product,
          {_id}, 
          product, 
          {upsert: false});
      } catch (err) {
        throw new Error(err);
      }
  }

  public async delete(id: ObjectId): Promise<Object> {
    console.log(`Deleting a product with id ${id}`);
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager; 
    const _id = new ObjectId(id);
      try {
        return await manager.findOneAndDelete(Product, {_id} );
      } catch (err) {
        throw new Error(err);
      }
  }

}

export const productService = new ProductService();
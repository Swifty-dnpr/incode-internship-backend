import { DatabaseProvider } from "../database/database";
import { Category } from "../models/Category";
import { ObjectId } from 'mongodb';
import { ObjectID } from 'typeorm';

export class CategoryService {
  public async getById(id: string): Promise<Category> {
    console.log(`Getting category with id: ${id}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      return await connection.mongoManager.findOne(Category, id);
    } catch (err) {
      throw new Error(err);
    }
  }

  public async getByTitle(title: string): Promise<Category> {
    console.log(`Getting category with title: ${title}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      return await connection.mongoManager.findOne(Category, {alias: title.toLowerCase()});
    } catch (err) {
      throw new Error(err);
    }
  }

  public async create(category: Category): Promise<Category> {
    console.log('Creating new category')
    const ctgry = new Category();
    ctgry.title = category.title;
    ctgry.alias = category.title.split(' ').join('').toLowerCase();
    ctgry.description = category.description;
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager;
    try {
      return await manager.save(ctgry);
    } catch (err) {
      throw new Error(err);
    }
    
  }

  public async list(): Promise<Category[]> {
    console.log('Returning list of categories');
    const connection = await DatabaseProvider.getConnection();
    return await connection.mongoManager.find(Category);
  }

  public async update(category: {body: string, title: string}, id: string): Promise<Object> {
     console.log('Updating a category')
     const connection = await DatabaseProvider.getConnection();
     const manager = connection.mongoManager; 
     const _id = new ObjectId(id);
      try {
        return await manager.findOneAndUpdate(Category,
          {_id}, 
          category, 
          {upsert: false});
      } catch (err) {
        throw new Error(err);
      }
  }

  public async delete(id: ObjectId): Promise<Object> {
    console.log('Deleting a category');
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager; 
    const _id = new ObjectId(id);
      try {
        return await manager.findOneAndDelete(Category, {_id} );
      } catch (err) {
        throw new Error(err);
      }
  }
}

export const categoryService = new CategoryService();
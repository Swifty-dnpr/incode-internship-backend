
import { ObjectID, Connection } from 'typeorm';
import { DatabaseProvider } from '../database/database';
import { Category } from '../models/Category';
import { InnerResponse } from '../types';

export class CategoryService {
  public async getById(id: ObjectID): Promise<InnerResponse> {
    console.log(`Getting category with id: ${id}`);
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const category: Category = await connection.mongoManager.findOne(Category, id);

      if (!category) {
        return new InnerResponse(404, {error: `Could not find a category with id ${id}`});
      }

      return new InnerResponse(200, { category });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async getByTitle(title: string): Promise<InnerResponse> {
    console.log(`Getting category with title: ${title}`);
    const connection: Connection = await DatabaseProvider.getConnection();
    try {
      const category: Category = await connection.mongoManager.findOne(Category, {alias: title.toLowerCase()});

      return new InnerResponse(200, { category });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async create(category: Category): Promise<InnerResponse> {
    console.log('Creating new category');
    const ctgry: Category = new Category();
    ctgry.title = category.title;
    ctgry.alias = category.title.split(' ').join('').toLowerCase();
    ctgry.description = category.description;

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      await connection.mongoManager.save(Category, ctgry);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }

  }

  public async list(): Promise<InnerResponse> {
    console.log('Returning list of categories');
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const categories: Category[] = await connection.mongoManager.find(Category);

      return new InnerResponse(200, { categories });
    }
    catch (error) {
      return new InnerResponse(400, { error: 'Something went wrong' });
    }
  }

  public async update(category: {body: string, title: string}, id: string): Promise<InnerResponse> {
    console.log(`Updating a category an id ${id}`);
    if (!id || id.length < 1) {
      return new InnerResponse(404, { error: `Category with id:${id} does not exist and can not be updated` });
    }

    const c_id: ObjectID = new ObjectID(id);

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const existingCategory: Category = await connection.mongoManager.findOne(Category, c_id);

      if (!existingCategory) {
        return new InnerResponse(404, { error: `Category with id:${id} does not exist and can not be updated` });
      }

      Object.assign(existingCategory, category);

      await connection.mongoManager.findOneAndUpdate(Category,
        {c_id},
        existingCategory,
        {upsert: false});

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, error);
    }
  }

  public async delete(id: string): Promise<InnerResponse> {
    console.log('Deleting a category');

    const c_id: ObjectID = new ObjectID(id);
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      await connection.mongoManager.findOneAndDelete(Category, c_id);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, error);
    }
  }
}

export const categoryService: CategoryService = new CategoryService();

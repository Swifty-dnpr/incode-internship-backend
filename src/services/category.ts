import { DatabaseProvider } from "../database/database";
import { Category } from "../models/Category";
import { ObjectId } from 'mongodb';
import { InnerResponse } from "../types";

export class CategoryService {
  public async getById(id: string): Promise<InnerResponse> {
    console.log(`Getting category with id: ${id}`);
    try {
      const connection = await DatabaseProvider.getConnection();  
      const category = await connection.mongoManager.findOne(Category, id);

      if (!category) {
        return new InnerResponse(404, {error: `Could not find a category with id ${id}`});
      }

      return new InnerResponse(200, { category });
    }
    catch (error) {
      return new InnerResponse(400, { error })
    }
  }

  public async getByTitle(title: string): Promise<InnerResponse> {
    console.log(`Getting category with title: ${title}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      const categories = await connection.mongoManager.findOne(Category, {alias: title.toLowerCase()});

      return new InnerResponse(200, { categories });
    }
    catch (error) {
      return new InnerResponse(400, { error })
    }
  }

  public async create(category: Category): Promise<InnerResponse> {
    console.log('Creating new category')
    const ctgry = new Category();
    ctgry.title = category.title;
    ctgry.alias = category.title.split(' ').join('').toLowerCase();
    ctgry.description = category.description;

    try {
      const connection = await DatabaseProvider.getConnection();
      await connection.mongoManager.save(Category, ctgry);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, { error })
    }
    
  }

  public async list(): Promise<InnerResponse> {
    console.log('Returning list of categories');
    const connection = await DatabaseProvider.getConnection();
    const categories = await connection.mongoManager.find(Category);

    return new InnerResponse(200, { categories });
  }

  public async update(category: {body: string, title: string}, id: string): Promise<InnerResponse> {
     console.log('Updating a category')
     const connection = await DatabaseProvider.getConnection();
     const manager = connection.mongoManager; 
     const _id = new ObjectId(id);

      try {
        await manager.findOneAndUpdate(Category,
          {_id}, 
          category, 
          {upsert: false});

        return new InnerResponse(200, undefined);
      }
      catch (error) {
        return new InnerResponse(400, error);
      }
  }

  public async delete(id: ObjectId): Promise<InnerResponse> {
    console.log('Deleting a category');
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager; 
    const _id = new ObjectId(id);
      try {
        await manager.findOneAndDelete(Category, {_id} );

        return new InnerResponse(200, undefined);
      }
      catch (error) {
        return new InnerResponse(400, error);
      }
  }
}

export const categoryService = new CategoryService();
import { Connection, ObjectID, FindOptions } from 'typeorm';
import { DatabaseProvider } from '../database/database';
import { Product, Category } from '../models';
import { InnerResponse, Filters, FiltersObject } from '../types';

export class ProductService {

  public async getById(id: string): Promise<InnerResponse> {
    console.log(`Getting product with id: ${id}`);

    if (!id || id.length < 1) {
      return new InnerResponse(404, { error: `Could not find a product with id ${id}`});
    }

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const product: Product = await connection.mongoManager.findOne(Product, id);

      if (!product) {
        return new InnerResponse(404, { error: `Could not find a product with id ${id}`});
      }

      return new InnerResponse(200, { product });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async getByCategory(category_title: string): Promise<InnerResponse> {
    console.log(`Getting products of category: ${category_title}`);
    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const products: Product[] = await connection.mongoManager.find(Product, { category_title });

      return new InnerResponse(200, { products });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async create(product: Product): Promise<InnerResponse> {
    console.log('Creating new product');
    const prdct: Product = new Product();
    Object.assign(prdct, product);

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const category: Category = await this.createCategoryOrAssignExisting(prdct, connection);
      prdct.category_id = category.id;
      const created: Product = await connection.mongoManager.save(Product, prdct);

      return new InnerResponse(200, { product: created });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }

  }

  public async list(filter: FiltersObject): Promise<InnerResponse> {
    console.log('Returning list of products');
    try {
      const filters: Filters = this.buildFilters(filter);
      const connection: Connection = await DatabaseProvider.getConnection();
      const products: Product[] = await connection.mongoManager.find(Product, filters as FindOptions<Product>);

      return new InnerResponse(200, { products });
    }
    catch (error) {
      return new InnerResponse(400, { error: 'Something went wrong' });
    }
  }

  public async update(prevProduct: Product, id: ObjectID): Promise<InnerResponse> {
    console.log(`Updating a product with id ${id}`);

    if (!id) {
      return new InnerResponse(404, { error: `Product with id:${id} does not exist and can not be updated` });
    }

    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      const existingProduct: Product = await connection.mongoManager.findOne(Product, id);

      if (!existingProduct) {
        return new InnerResponse(404, { error: `Product with id:${id} does not exist and can not be updated` });
      }

      delete prevProduct.id;

      Object.assign(existingProduct, prevProduct);

      if (!existingProduct.category_id) {
        const category: Category = await this.createCategoryOrAssignExisting(prevProduct, connection);
        existingProduct.category_id = category.id;
      }

      await connection.mongoManager.findOneAndUpdate(Product,
        { _id: existingProduct.id },
        existingProduct,
        {upsert: false});

      return new InnerResponse(200, undefined);
    } catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async delete(id: ObjectID): Promise<InnerResponse> {
    console.log(`Deleting a product with id ${id}`);
    try {
      const connection: Connection = await DatabaseProvider.getConnection();

      await connection.mongoManager.delete(Product, id);

      return new InnerResponse(200, undefined);
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }
  }

  public async getCountOfCategory(category_id: string): Promise<InnerResponse> {

    try {
      const connection: Connection = await DatabaseProvider.getConnection();
      const cat_id: ObjectID = new ObjectID(category_id);
      const products: Product[] = await connection.mongoManager.find(Product, { category_id: cat_id });

      return new InnerResponse(200, { count: products.length });
    }
    catch (error) {
      return new InnerResponse(400, { error });
    }

  }

  private async createCategoryOrAssignExisting(product: Product, connection: Connection): Promise<Category> {
    let category: Category;

    try {
      category = await connection.mongoManager.findOne(Category, {title: product.category_title});

      if (!category) {
        const temp: {title: string; description: string} = {
          title: product.category_title,
          description: '',
        };

        category = await connection.mongoManager.save(Category, temp) as Category;
      }
    } catch (error) {
      throw new Error(error);
    }

    return category;
  }

  private buildFilters(filters: FiltersObject): Filters {
    const filter: Filters = {};

    if (filters.price) {
      const [from, to]: string[] = filters.price.split('to');

      filter.price = {
        $gt: Number(from) ? Number(from) : 0,
      };

      if (+to > +from) {
        filter.price.$lt = Number(to);
      }
    }

    if (filters.stock) {
      filter.stock = {
        $gt: +filters.stock,
      };
    }

    if (filters.category) {
      filter.category_title = filters.category;
    }

    return filter;
  }

}

export const productService: ProductService = new ProductService();

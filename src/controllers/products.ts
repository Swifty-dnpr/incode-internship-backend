import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { productService } from '../services/product';
import { Request, Response } from 'restify';
import { InnerResponse } from '../types';
import { BaseController } from './base';

export class ProductController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/products', this.list.bind(this));
    httpServer.get('/products/:id', this.getById.bind(this));
    httpServer.post('/products', this.create.bind(this));
    httpServer.put('/products/:id', this.update.bind(this));
    httpServer.delete('/products/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    let result: InnerResponse;

    if (req.query.category) {
      result = await productService.getByCategory(req.query.category);

      return BaseController.handleResponse(result, res);
    }

    result = await productService.list();

    BaseController.handleResponse(result, res);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await productService.getById(req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await productService.create(req.body)

    BaseController.handleResponse(result, res);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await productService.update(req.body, req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async remove(req: Request, res: Response): Promise<void> {  
    const result: InnerResponse = await productService.delete(req.params.id);

    BaseController.handleResponse(result, res);
  }
}
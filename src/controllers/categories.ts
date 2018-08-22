import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { categoryService } from '../services/category';
import { Request, Response } from 'restify';
import { InnerResponse } from '../types';
import { BaseController } from './base';
import { productService } from '../services/product';

export class CategoryController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/categories', this.list.bind(this));
    httpServer.get('/categories/:id', this.getById.bind(this));
    httpServer.post('/categories', this.create.bind(this));
    httpServer.put('/categories/:id', this.update.bind(this));
    httpServer.delete('/categories/:id', this.remove.bind(this));
    httpServer.get('/categories/:id/count', this.getCount.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    if (req.query.title) {
      return this.getByTitle(req, res);
    }

    const result: InnerResponse = await categoryService.list();

    BaseController.handleResponse(result, res);
  }

  private async getByTitle(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.getByTitle(req.query.title);

    BaseController.handleResponse(result, res);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.getById(req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.create(req.body)

    BaseController.handleResponse(result, res);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.update(req.body, req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const result: InnerResponse  = await categoryService.delete(req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async getCount(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await productService.getCountOfCategory(req.params.id);

    BaseController.handleResponse(result, res);
  }
}
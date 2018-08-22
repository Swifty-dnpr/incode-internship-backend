import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { categoryService } from '../services/category';
import { Request, Response } from 'restify';
import { InnerResponse } from '../types';

export class CategoryController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/categories', this.list.bind(this));
    httpServer.get('/categories/:id', this.getById.bind(this));
    httpServer.post('/categories', this.create.bind(this));
    httpServer.put('/categories/:id', this.update.bind(this));
    httpServer.delete('/categories/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    if (req.query.title) {
      return this.getByTitle(req, res);
    }

    const result: InnerResponse = await categoryService.list();

    res.status(result.status);
    res.send(result.data);
  }

  private async getByTitle(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.getByTitle(req.query.title);

    res.status(result.status);
    res.send(result.data);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.getById(req.params.id);

    res.status(result.status);
    res.send(result.data);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.create(req.body)

    res.status(result.status);
    res.send(result.data);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await categoryService.update(req.body, req.params.id);

    res.status(result.status);
    res.send(result.data);
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const result: InnerResponse  = await categoryService.delete(req.params.id);

    res.status(result.status);
    res.send(result.data);
  }
}
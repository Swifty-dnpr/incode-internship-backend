import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { categoryService } from '../services/category';
import { Request, Response } from 'restify';

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
      res.send(await categoryService.getByTitle(req.query.title))
      return;
    }
    res.send(await categoryService.list());
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const category = await categoryService.getById(req.params.id);
    res.send(category ? 200 : 404, category ? category : {error: 'Not found'});
  }

  private async create(req: Request, res: Response): Promise<void> {
    res.send(await categoryService.create(req.body));
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result = await categoryService.update(req.body, req.params.id);
    res.send(!result.value ? 400 : 200, !result.value ? {error: 'something went wrong'} : {success: true})
  }

  private async remove(req: Request, res: Response): Promise<void> {
    let result;
    if (req.query.title) {
      result = await categoryService.deleteByTitle(req.query.title);
    } else {
      result = await categoryService.delete(req.params.id);
    }
    
    res.send(!result.value ? 400 : 200, !result.value  ? {error: 'something went wrong'} : {success: true})
  }
}
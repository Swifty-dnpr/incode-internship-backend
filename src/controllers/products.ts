import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { productService } from '../services/product';
import { Request, Response } from 'restify';

export class ProductController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/products', this.list.bind(this));
    httpServer.get('/products/:id', this.getById.bind(this));
    httpServer.post('/products', this.create.bind(this));
    httpServer.put('/products/:id', this.update.bind(this));
    httpServer.delete('/products/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    if (req.query.title) {
      res.send(await productService.getByCategory(req.query.title))
      return;
    }
    res.send(await productService.list());
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const product = await productService.getById(req.params.id);
    res.send(product ? 200 : 404, product ? product : {error: 'Not found'});
  }

  private async create(req: Request, res: Response): Promise<void> {
    res.send(await productService.create(req.body));
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result = await productService.update(req.body, req.params.id);
    res.send(!result.value ? 400 : 200, !result.value ? {error: 'something went wrong'} : {success: true})
  }

  private async remove(req: Request, res: Response): Promise<void> {
    let result;
    if (req.query.category) {
      result = await productService.deleteByTitle(req.query.category);
    } else {
      result = await productService.delete(req.params.id);
    }
    
    res.send(!result.value ? 400 : 200, !result.value  ? {error: 'something went wrong'} : {success: true})
  }
}
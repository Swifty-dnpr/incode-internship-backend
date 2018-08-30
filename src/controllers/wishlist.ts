import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { InnerResponse } from '../types';
import { BaseController } from './base';
import { wishlistService } from '../services/wishlist';

export class WishlistController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/wishlists', this.list.bind(this));
    httpServer.get('/wishlists/:id', this.getById.bind(this));
    httpServer.post('/wishlists', this.create.bind(this));
    httpServer.put('/wishlists/:id', this.update.bind(this));
    httpServer.delete('/wishlists/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    const result: InnerResponse  = await wishlistService.list();

    BaseController.handleResponse(result, res);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await wishlistService.getById(req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await wishlistService.create(req.body);

    BaseController.handleResponse(result, res);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await wishlistService.update(req.body, req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await wishlistService.delete(req.params.id);

    BaseController.handleResponse(result, res);
  }
}

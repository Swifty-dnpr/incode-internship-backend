import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { Request, Response } from 'restify';
import { InnerResponse } from '../types';
import { BaseController } from './base';
import { orderService } from '../services/order';

export class OrderController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/orders', this.list.bind(this));
    httpServer.get('/orders/:id', this.getById.bind(this));
    httpServer.post('/orders', this.create.bind(this));
    httpServer.put('/orders/:id', this.update.bind(this));
    httpServer.delete('/orders/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
    const result: InnerResponse  = await orderService.list();

    BaseController.handleResponse(result, res);
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await orderService.getById(req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async create(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await orderService.create(req.body);

    BaseController.handleResponse(result, res);
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await orderService.update(req.body, req.params.id);

    BaseController.handleResponse(result, res);
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await orderService.delete(req.params.id);

    BaseController.handleResponse(result, res);
  }
}

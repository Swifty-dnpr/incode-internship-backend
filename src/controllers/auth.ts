import { Request, Response } from 'restify';

import { authService } from '../services/auth';
import { BaseController } from './base';
import { Controller } from './controller';
import { InnerResponse } from '../types';

import { HttpServer } from '../server/httpServer';

export class AuthController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.post('/auth', this.authenticate.bind(this));
    httpServer.get('/user', this.getUser.bind(this));
    httpServer.post('/login', this.login.bind(this));
  }

  private async authenticate(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await authService.authenticate(req.body);

    BaseController.handleResponse(result, res);
  }

  private async getUser(req: Request & {user: any}, res: Response): Promise<void> {
    res.send(req.user);
  }

  private async login(req: Request, res: Response): Promise<void> {
    const result: InnerResponse = await authService.login(req.body);

    BaseController.handleResponse(result, res);
  }
}

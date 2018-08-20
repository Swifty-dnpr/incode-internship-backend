import { Request, Response } from 'restify';
import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { authService } from '../services/auth';

export class AuthController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.post('/auth', this.authenticate.bind(this));
    httpServer.get('/user', this.getUser.bind(this));
    httpServer.post('/login', this.login.bind(this));
  }

  private async authenticate(req: Request, res: Response): Promise<any> {
    const result = await authService.authenticate(req.body);
    res.status(result.status);
    res.send(result.data);
  }

  private async getUser(req: Request & {user: any}, res: Response): Promise<any> {
    res.send(req.user);
  }

  private async login(req: Request & {user: any}, res: Response): Promise<any> {
    const result = await authService.login(req.body);
    res.status(result.status);
    res.send(result.data);
  }
}

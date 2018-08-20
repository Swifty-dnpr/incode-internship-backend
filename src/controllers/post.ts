import { Controller } from './controller';
import { HttpServer } from '../server/httpServer';
import { postService } from '../services/post';
import { Request, Response } from 'restify';

export class PostController implements Controller {
  public initialize(httpServer: HttpServer): void {
    httpServer.get('/posts', this.list.bind(this));
    httpServer.get('/posts/:id', this.getById.bind(this));
    httpServer.post('/posts', this.create.bind(this));
    httpServer.put('/posts/:id', this.update.bind(this));
    httpServer.delete('/posts/:id', this.remove.bind(this));
  }

  private async list(req: Request, res: Response): Promise<void> {
     res.send(await postService.list());
  }

  private async getById(req: Request, res: Response): Promise<void> {
    const post = await postService.getById(req.params.id);
    res.send(post ? 200 : 404, post ? post : {error: 'Not found'});
  }

  private async create(req: Request, res: Response): Promise<void> {
    res.send(await postService.create(req.body));
  }

  private async update(req: Request, res: Response): Promise<void> {
    const result = await postService.update(req.body, req.params.id);
    res.send(!result.value ? 400 : 200, !result.value ? {error: 'something went wrong'} : {success: true})
  }

  private async remove(req: Request, res: Response): Promise<void> {
    const result = await postService.delete(req.params.id);
    res.send(!result.value ? 400 : 200, !result.value  ? {error: 'something went wrong'} : {success: true})
  }
}
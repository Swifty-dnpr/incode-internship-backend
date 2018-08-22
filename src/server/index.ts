import { HttpServer } from './httpServer';
import * as restify from 'restify';
import { CONTOLLERS } from '../controllers';
import * as CORS from 'restify-cors-middleware';
import * as config from '../../config.json';
import * as rjwt from 'restify-jwt-community';
import { Controller } from '../controllers/controller';

const cors: any = CORS({
  preflightMaxAge: 5,
  origins: ['http://localhost:4200'],
  allowHeaders: [],
  exposeHeaders: [],
});

export class ApiServer implements HttpServer {
  private restify: restify.Server;

  public get(url: string, requestHandler: restify.RequestHandler): void {
    this.addRoute('get', url, requestHandler);
  }

  public post(url: string, requestHandler: restify.RequestHandler): void {
    this.addRoute('post', url, requestHandler);
  }

  public put(url: string, requestHandler: restify.RequestHandler): void {
    this.addRoute('put', url, requestHandler);
  }

  public delete(url: string, requestHandler: restify.RequestHandler): void {
    this.addRoute('del', url, requestHandler);
  }

  private addRoute(method: 'get' | 'post' | 'put' | 'del', url: string, requestHandler: restify.RequestHandler): void {
    this.restify[method](url, async (req: restify.Request, res: restify.Response, next: restify.Next) => {
      try {
        await requestHandler(req, res, next);
      }
      catch (error) {
        console.log(error);
        res.send(500, error);
      }
    });

    console.log(`Added route ${method.toUpperCase()}: ${url}`);
  }

  public start(port: number): void {
    this.restify = restify.createServer();
    this.restify.use(rjwt(config.jwt).unless({
      path: ['/auth', '/login', '/ping'],
    }));
    this.restify.use(restify.plugins.bodyParser());
    this.restify.use(restify.plugins.queryParser());
    this.restify.pre(cors.preflight);
    this.restify.use(cors.actual);

    CONTOLLERS.forEach((ctrl: Controller) => ctrl.initialize(this));

    this.restify.listen(port, () => console.log(`Server is up on port: ${port}`));
  }
}

import { HttpServer } from './httpServer';
import * as restify from 'restify';
import { RequestHandler, Server } from 'restify';
import { CONTOLLERS } from '../controllers';
import * as Cors  from 'restify-cors-middleware';
import * as config from '../../config';
import * as rjwt from 'restify-jwt-community';

const cors = Cors({
  preflightMaxAge: 5,
  origins: ['http://localhost:4200'],
  allowHeaders: [],
  exposeHeaders: []
});

export class ApiServer implements HttpServer {
  private restify: Server;

  public get(url: string, requestHandler: RequestHandler): void {
    this.addRoute('get', url, requestHandler);
  }

  public post(url: string, requestHandler: RequestHandler): void {
    this.addRoute('post', url, requestHandler);
  }

  public put(url: string, requestHandler: RequestHandler): void {
    this.addRoute('put', url, requestHandler);
  }

  public delete(url: string, requestHandler: RequestHandler): void {
    this.addRoute('del', url, requestHandler);
  }

  private addRoute(method: 'get' | 'post' | 'put' | 'del', url: string, requestHandler: RequestHandler): void {
    this.restify[method](url, async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      }
      catch(err) {
        console.log(err);
        res.send(500, err);
      }
    });

    console.log(`Added route ${method.toUpperCase()}: ${url}`);
  }  

  public start(port: number): void {
    this.restify = restify.createServer();
    this.restify.use(rjwt(config.jwt).unless({
      path: ['/auth', '/login', '/ping']
    }));
    this.restify.use(restify.plugins.bodyParser());
    this.restify.use(restify.plugins.queryParser());
    this.restify.pre(cors.preflight);
    this.restify.use(cors.actual);

    CONTOLLERS.forEach(ctrl => ctrl.initialize(this))

    this.restify.listen(port, () => console.log(`Server is up on port: ${port}`));
  }
}
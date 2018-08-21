import * as restify from 'restify';
import * as swaggerUi from 'swagger-ui-restify';
import * as swaggerTools from 'swagger-tools';
import * as YAML from 'yamljs';
import { Server } from "restify";

const swaggerDocs = YAML.load(__dirname + '/../api/swagger/swagger.yaml')

export class SwaggerServer {
  private restify: Server;

  public start(port: number): void {
    this.restify = restify.createServer();

    swaggerTools.initializeMiddleware(swaggerDocs, (middleware) => {

      ['get', 'put', 'post', 'del', 'head'].forEach((verb: string) => {
        this.restify[verb]('/*', middleware.swaggerUi({
          swaggerUi: '/',
          apiDocsPath: swaggerDocs
        }));
      });

      this.restify.listen(port, () => console.log(`API documentation is up on port ${port}`))
    })
  }
}
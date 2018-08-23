import * as restify from 'restify';
import * as swaggerTools from 'swagger-tools';
import * as YAML from 'yamljs';

const swaggerDocs: string = YAML.load(__dirname + '/../../api/swagger/swagger.yaml');

export class SwaggerServer {
  private restify: restify.Server;

  public start(port: number): void {
    this.restify = restify.createServer();

    swaggerTools.initializeMiddleware(swaggerDocs, (middleware: { swaggerUi(config: object): object }) => {

      ['get', 'put', 'post', 'del', 'head'].forEach((verb: string) => {
        this.restify[verb]('/*', middleware.swaggerUi({
          swaggerUi: '/',
          apiDocsPath: swaggerDocs,
        }));
      });

      this.restify.listen(port, () => console.log(`API documentation is up on port ${port}`));
    });
  }
}

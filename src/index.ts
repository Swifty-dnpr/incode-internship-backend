import 'reflect-metadata';
import { ApiServer } from './server';
import { SwaggerServer } from './server/swaggerServer';

const server: ApiServer = new ApiServer();
const swagger: SwaggerServer = new SwaggerServer();

server.start(Number(process.env.PORT) || 8000);
swagger.start(Number(process.env.PORT) || 8080);

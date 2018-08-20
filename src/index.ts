import 'reflect-metadata';
import { ApiServer } from './server';

const server = new ApiServer();
server.start(Number(process.env.PORT) | 8000);
import { PingController } from './ping';
import { CategoryController } from './categories';
import { AuthController } from './auth';
import { ProductController } from './products';
import "reflect-metadata";

export const CONTOLLERS = [
  new CategoryController(),
  new PingController(),
  new AuthController(),
  new ProductController()
]
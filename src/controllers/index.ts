import { PostController } from './post';
import { PingController } from './ping';
import { CategoryController } from './categories';
import "reflect-metadata";

export const CONTOLLERS = [
  new PostController(),
  new CategoryController(),
  new PingController()
]
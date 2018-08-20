import { createConnection, Connection } from 'typeorm';
import { Post } from '../models/Post';
import { Category } from '../models/Category';

export interface DatabaseConfiguration {
  type: 'mongodb';
  host: string;
  port: number;
  database: string;
}

export class DatabaseProvider {
  private static connection: Connection;
  private static configuration: DatabaseConfiguration;

  public static configure(config: DatabaseConfiguration): void {
    DatabaseProvider.configuration = config;
  }

  public static async getConnection(): Promise<Connection> {

    if (DatabaseProvider.connection) {
      return DatabaseProvider.connection;
    }

   DatabaseProvider.connection = await createConnection({
     type: 'mongodb',
     host: 'localhost',
     port: 27017,
     database: 'posts',
     entities: [Post, Category]
   });

   return DatabaseProvider.connection;
  }
}
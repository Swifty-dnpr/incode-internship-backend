import { DatabaseProvider } from "../database/database";
import { Post } from "../models/Post";
import { ObjectId } from 'mongodb';
import { ObjectID } from 'typeorm';

export class PostService {
  public async getById(id: string): Promise<Post> {
    console.log(`Getting post with id: ${id}`);
    const connection = await DatabaseProvider.getConnection();
    try {
      return await connection.mongoManager.findOne(Post, [ id ]);
    } catch (err) {
      throw new Error(err);
    }
    
  }

  public async create(post: Post): Promise<Post> {
    console.log('Creating new post')
    const pst = new Post();
    pst.title = post.title;
    pst.body = post.body;
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager;
    try {
      return await manager.save(pst);
    } catch (err) {
      throw new Error(err);
    }
    
  }

  public async list(): Promise<Post[]> {
    console.log('Returning list of posts');
    const connection = await DatabaseProvider.getConnection();
    return await connection.mongoManager.find(Post, {});
  }

  public async update(post: {body: string, title: string}, id: string): Promise<Post> {
     console.log('Updating a post')
     const connection = await DatabaseProvider.getConnection();
     const manager = connection.mongoManager; 
     const _id = new ObjectId(id);
      try {
        return await manager.findOneAndUpdate(Post,
          {_id}, 
          post, 
          {upsert: false});
      } catch (err) {
        throw new Error(err);
      }
  }

  public async delete(id: number): Promise<void> {
    console.log('Deleting a post');
    const connection = await DatabaseProvider.getConnection();
    const manager = connection.mongoManager; 
    const _id = new ObjectId(id);
      try {
        return await manager.findOneAndDelete(Post, {_id} );
      } catch (err) {
        throw new Error(err);
      }
  }
}

export const postService = new PostService();
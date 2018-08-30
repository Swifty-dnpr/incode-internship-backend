import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity()
export class Wishlist {

  @ObjectIdColumn({ name: '_id' })
  public id: ObjectID;

  @Column()
  public client: User;

  @Column()
  public items: Product[];

}

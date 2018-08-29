import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';
import { User } from './User';
import { OrderItems } from '../types';

@Entity()
export class Order {

  @ObjectIdColumn({ name: '_id' })
  public id: ObjectID;

  @Column()
  public date: number;

  @Column()
  public client: User;

  @Column()
  public total: number;

  @Column()
  public items: OrderItems;

}

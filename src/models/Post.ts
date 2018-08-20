import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Post {

  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ length: 255 })
  public title: string;

  @Column()
  public body: string;

  @Column()
  public category_id: ObjectID;
  
  @Column()
  public category_title: string;
}
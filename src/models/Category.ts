import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Category {

  @ObjectIdColumn({ name: '_id' })
  public id: ObjectID;

  @Column({ length: 255 })
  public title: string;

  @Column({ length: 255 })
  public alias: string;

  @Column()
  public description: string;

}
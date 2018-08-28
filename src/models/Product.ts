import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Product {

  @ObjectIdColumn({ name: '_id' })
  public id: ObjectID;

  @Column({ length: 255 })
  public title: string;

  @Column()
  public description: string;

  @Column()
  public category_id: ObjectID;

  @Column()
  public category_title: string;

  @Column()
  public price: number;

  @Column()
  public stock: number;

  @Column()
  public thumbnail: string;

}

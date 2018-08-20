import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class Category {

  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ length: 255 })
  public title: string;

  @Column({ length: 255 })
  public m_title: string;

  @Column()
  public description: string;

}
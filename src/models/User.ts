import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {

  @ObjectIdColumn()
  public id: ObjectID;

  @Column({ length: 25 })
  public login: string;

  @Column()
  public password: string;

  @Column({ length: 25 })
  public first_name: string
  
  @Column({ length: 25 })
  public last_name: string

}

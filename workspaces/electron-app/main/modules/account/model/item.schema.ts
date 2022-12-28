import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("item")
export class Item {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name: string = "";
}

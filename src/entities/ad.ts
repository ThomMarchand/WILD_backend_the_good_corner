import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  title: string;

  @Column()
  description: string;

  @Column({ length: 100 })
  owner: string;

  @Column()
  price: string;

  @Column({ length: 255 })
  picture: string;

  @Column({ length: 100 })
  location: string;
}

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Ad from "./Ad";

@Entity()
export default class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];
}

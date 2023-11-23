import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Ad from "./Ad";

@Entity()
export default class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads: Ad[];
}

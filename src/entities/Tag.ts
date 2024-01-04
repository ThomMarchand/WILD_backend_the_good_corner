import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

import Ad from "./Ad";

@ObjectType()
@Entity()
export default class Tag extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field(() => [Ad])
  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads: Ad[];
}

@InputType()
export class TagCategory {
  @Field()
  name: string;
}

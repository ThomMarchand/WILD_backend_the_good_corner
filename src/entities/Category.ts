import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

import Ad from "./Ad";

@ObjectType()
@Entity()
export default class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  name: string;

  @Field(() => [Ad])
  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];
}

@InputType()
export class CategoryInput {
  @Field()
  name: string;
}

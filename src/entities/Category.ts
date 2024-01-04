import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Field, InputType, ObjectType } from "type-graphql";

import Ad from "./Ad";
import { Length } from "class-validator";

@ObjectType()
@Entity()
export default class Category extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Ad])
  @OneToMany(() => Ad, (ad) => ad.category)
  ads: Ad[];
}

@InputType()
export class CategoryInput {
  @Field()
  @Length(2, 30, { message: "Le nom doit contenir entre 2 et 30 caractères" })
  name: string;
}

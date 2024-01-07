import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Length, Min } from "class-validator";
import { Field, Float, InputType, Int, ObjectType } from "type-graphql";

import Category from "./Category";
import Tag from "./Tag";
import { ObjectId } from "../type";

@Entity()
@ObjectType()
export default class Ad extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ length: 100 })
  title: string;

  @Field()
  @Column({ type: "text", nullable: true })
  description: string;

  @Field()
  @Column({ length: 100 })
  owner: string;

  @Field()
  @Column({ type: "float" })
  price: number;

  @Field()
  @Column({ length: 255 })
  picture: string;

  @Field()
  @Column({ length: 100 })
  location: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Category)
  @ManyToOne(() => Category, (c) => c.ads, {
    cascade: true,
    onDelete: "CASCADE",
  })
  category: Category;

  @JoinTable()
  @Field(() => [Tag])
  @ManyToMany(() => Tag, (t) => t.ads, {
    cascade: true,
  })
  tags: Tag[];
}

@InputType()
export class UpdateAdInput {
  @Field({ nullable: true })
  @Length(5, 100, {
    message: "Le titre doit contenir entre 5 et 100 caractères",
  })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  owner?: string;

  @Field(() => Float, { nullable: true })
  @Min(0, { message: "le prix doit etre positif" })
  price?: number;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field(() => Int, { nullable: true })
  category?: number;

  @Field(() => [ObjectId], { nullable: true })
  tags?: ObjectId[];
}

@InputType()
export class NewAdInput {
  @Field()
  @Length(5, 100, {
    message: "Le titre doit contenir entre 5 et 100 caractères",
  })
  title: string;

  @Field()
  description: string;

  @Field()
  owner: string;

  @Field(() => Float)
  @Min(0, { message: "le prix doit etre positif" })
  price: number;

  @Field()
  location: string;

  @Field()
  picture: string;

  @Field(() => Int)
  category: number;

  @Field(() => [ObjectId], { nullable: true })
  tags?: ObjectId[];
}

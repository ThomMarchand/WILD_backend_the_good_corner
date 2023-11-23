import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Length, Min } from "class-validator";

import Category from "./Category";
import Tag from "./Tag";

@Entity()
export default class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Length(5, 100, {
    message: "le titre doit contenir entre 10 et 100 caractères",
  })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column()
  owner: string;

  @Column({ type: "float" })
  @Min(0, { message: "Le prix doit êtres suppérieur à 0" })
  price: string;

  @Column({ length: 255 })
  picture: string;

  @Column({ length: 100 })
  location: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Category, (category) => category.ads)
  category: Category;

  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.ads)
  tags: Tag[];
}

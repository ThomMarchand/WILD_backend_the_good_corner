import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { Like } from "typeorm";
import { validate } from "class-validator";

import Category, { CategoryInput } from "../entities/Category";

@Resolver(Category)
export default class CategoryResolver {
  @Query(() => [Category])
  categories() {
    return Category.find({ relations: { ads: true } });
  }

  @Query(() => [Category])
  async getCategoryByName(@Arg("name") name: string) {
    const category = await Category.find({
      relations: {
        ads: true,
      },
      where: { name: Like(`%${name}%`) },
    });

    if (category.length === 0) throw new GraphQLError("category not found");

    return category;
  }

  @Mutation(() => Category)
  async createCategory(@Arg("data") data: CategoryInput) {
    const newCategory = Category.create(data as any);
    const errors = await validate(newCategory);

    if (errors.length > 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });

    return await newCategory.save();
  }
}

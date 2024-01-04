import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { Like } from "typeorm";
import { validate } from "class-validator";

import Category, { CategoryInput } from "../entities/Category";

@Resolver(Category)
export default class CategoryResolver {
  @Query(() => [Category])
  async categories(@Arg("name", { nullable: true }) name: string) {
    const categories = await Category.find({
      relations: {
        ads: true,
      },
      where: {
        name: name ? Like(`%${name}%`) : undefined,
      },
      order: { id: "desc" },
    });

    return categories;
  }

  @Query(() => Category)
  async getCategoryById(@Arg("categoryId") id: number) {
    const category = await Category.findOneBy({ id });

    if (!category) throw new GraphQLError("Category not found");

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

  @Mutation(() => Category)
  async updateCategory(
    @Arg("categoryId") id: number,
    @Arg("data") data: CategoryInput
  ) {
    const toUpdate = await this.getCategoryById(id);

    await Object.assign(toUpdate, data);
    await toUpdate.save();

    return toUpdate;
  }

  @Mutation(() => String)
  async deleteCategory(@Arg("categoryId") id: number) {
    const toDelete = await this.getCategoryById(id);

    await toDelete.remove();

    return "deleted ok";
  }
}

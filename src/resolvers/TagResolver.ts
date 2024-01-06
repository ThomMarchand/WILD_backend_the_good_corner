import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { Like } from "typeorm";

import Tag, { NewTagCategory, TagCategory } from "../entities/Tag";
import { validate } from "class-validator";

@Resolver(Tag)
export default class TagResolver {
  @Query(() => [Tag])
  async getTagByName(@Arg("name", { nullable: true }) name: string) {
    const tag = await Tag.find({
      where: { name: name ? Like(`%${name}%`) : undefined },
      order: { id: "desc" },
    });

    if (tag.length === 0) throw new GraphQLError("tag not found");

    return tag;
  }

  @Query(() => Tag)
  async getTagById(@Arg("tagId") id: number) {
    const tag = await Tag.findOneBy({ id });

    if (!tag) throw new GraphQLError("tag not found");

    return tag;
  }

  @Mutation(() => Tag)
  async createTag(@Arg("data") data: NewTagCategory) {
    const newTag = Tag.create(data as any);
    const errors = await validate(newTag);

    if (errors.length > 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });

    return await newTag.save();
  }

  @Mutation(() => Tag)
  async updateTag(@Arg("tagId") id: number, @Arg("data") data: TagCategory) {
    const toUpdate = await this.getTagById(id);

    await Object.assign(toUpdate, data);

    return await toUpdate.save();
  }

  @Mutation(() => String)
  async deleteTag(@Arg("tadId") id: number) {
    const toDelete = await this.getTagById(id);

    await toDelete.remove();

    return "deleted";
  }
}

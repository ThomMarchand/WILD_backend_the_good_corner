import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { Like } from "typeorm";

import Tag, { TagCategory } from "../entities/Tag";
import { validate } from "class-validator";

@Resolver(Tag)
export default class TagResolver {
  @Query(() => [Tag])
  tags() {
    return Tag.find({ relations: { ads: true } });
  }

  @Query(() => Tag)
  async getTagById(@Arg("id") id: number) {
    const tag = await Tag.findOneBy({ id });
    console.log(tag);

    return tag;
  }

  @Query(() => [Tag])
  async getTagByName(@Arg("name") name: string) {
    const tag = await Tag.find({
      where: { name: Like(`%${name}%`) },
    });

    if (tag.length === 0) throw new GraphQLError("tag not found");

    return tag;
  }

  @Mutation(() => Tag)
  async createTag(@Arg("data") data: TagCategory) {
    const newTag = Tag.create(data as any);
    const errors = await validate(newTag);

    if (errors.length > 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });

    return await newTag.save();
  }

  @Mutation(() => Tag)
  async deleteTag(@Arg("id") id: number) {
    this.getTagById(id);
    return "glop";
    // const toDelete = await Tag.findOne({
    //   where: { id },
    // });

    // if (!toDelete) throw new GraphQLError("tag not found");

    // await toDelete; //.remove();

    // return this.tags();
  }
}

import { Resolver, Query, Arg, Mutation, Int } from "type-graphql";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";
import { In, Like } from "typeorm";

import Ad, { UpdateAdInput, NewAdInput } from "../entities/Ad";

@Resolver(Ad)
export default class AdResolver {
  @Query(() => [Ad])
  async ads(
    @Arg("tagsId", { nullable: true }) tagIds?: string,
    @Arg("categoryId", () => Int, { nullable: true }) categoryId?: number,
    @Arg("title", { nullable: true }) title?: string
  ) {
    const ads = await Ad.find({
      relations: { category: true, tags: true },
      order: {
        createdAt: "desc",
      },
      where: {
        tags: {
          id:
            typeof tagIds === "string" && tagIds.length > 0
              ? In(tagIds.split(",").map((t) => parseInt(t, 10)))
              : undefined,
        },
        title: title ? Like(`%${title}%`) : undefined,
        category: {
          id: categoryId,
        },
      },
      take: 10,
    });

    return ads;
  }

  @Query(() => Ad)
  async getAdById(
    @Arg("adId", () => Int) id: number,
    @Arg("isTrue", { defaultValue: true, nullable: true }) isTrue?: boolean
  ) {
    const ad = await Ad.findOne({
      where: { id },
      relations: { category: isTrue, tags: isTrue },
    });

    if (!ad) throw new GraphQLError("ad not found");

    return ad;
  }

  @Mutation(() => Ad)
  async createAd(@Arg("data") data: NewAdInput) {
    const newAd = Ad.create(data as any);
    const errors = await validate(newAd);

    if (errors.length > 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });

    return await newAd.save();
  }

  @Mutation(() => Ad)
  async updateAd(
    @Arg("adId") id: number,
    @Arg("data", { nullable: true }) data: UpdateAdInput
  ) {
    const toUpdate = await this.getAdById(id);

    await Object.assign(toUpdate, data);
    await toUpdate.save();

    return this.getAdById(id, true);
  }

  @Mutation(() => String)
  async deleteAd(@Arg("adId") id: number) {
    const toDelete = await this.getAdById(id);

    await toDelete.remove();

    return "deleted ok";
  }
}

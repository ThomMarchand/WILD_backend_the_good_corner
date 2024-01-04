import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { GraphQLError } from "graphql";
import { validate } from "class-validator";

import Ad, { AdInput } from "../entities/Ad";

@Resolver(Ad)
export default class AdResolver {
  @Query(() => [Ad])
  async ads() {
    const ads = await Ad.find({
      relations: { category: true, tags: true },
      take: 10,
    });

    return ads;
  }

  @Query(() => Ad)
  async getAdById(@Arg("id") id: string) {
    const ad = await Ad.findOne({
      where: { id: parseInt(id, 10) },
      relations: { category: true, tags: true },
    });

    if (!ad) throw new GraphQLError("ad not found");

    return ad;
  }

  @Mutation(() => Ad)
  async createAd(@Arg("data") data: AdInput) {
    const newAd = Ad.create(data as any);
    const errors = await validate(newAd);

    if (errors.length > 0)
      throw new GraphQLError("invalid data", { extensions: { errors } });

    const newAdWithId = await newAd.save();

    return this.getAdById(newAdWithId.id);
  }
}

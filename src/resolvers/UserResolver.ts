import { Arg, Mutation } from "type-graphql";
import User, { NewUserIntput } from "../entities/user";
import { GraphQLError } from "graphql";

export default class UserResolver {
  @Mutation(() => User)
  async CreateUser(@Arg("data", { validate: true }) data: NewUserIntput) {
    const existingUser = await User.findOneBy({ email: data.email });

    if (existingUser) {
      throw new GraphQLError("email already exist");
    }

    const newUser = new User();

    Object.assign(newUser, data);

    const newUserWithId = await newUser.save();

    return newUserWithId;
  }
}

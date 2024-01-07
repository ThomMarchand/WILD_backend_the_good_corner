import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSchema } from "type-graphql";

import AdResolver from "./resolvers/AdResolver";
import CategoryResolver from "./resolvers/CategoryResolver";
import TagResolver from "./resolvers/TagResolver";
import { initializeDB } from "./db";

buildSchema({ resolvers: [AdResolver, CategoryResolver, TagResolver] }).then(
  (schema) => {
    const server = new ApolloServer({ schema });
    startStandaloneServer(server, {
      listen: { port: 4001 },
    }).then(({ url }) => {
      initializeDB();
      console.log(`server ready on ${url}`);
    });
  }
);

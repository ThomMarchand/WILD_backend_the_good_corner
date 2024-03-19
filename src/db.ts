import { DataSource } from "typeorm";
import Ad from "./entities/Ad";
import Category from "./entities/Category";
import Tag from "./entities/Tag";
import env from "./env";
import User from "./entities/user";

export const db = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  entities: [Ad, Category, Tag, User],
  synchronize: true,
});

export const initializeDB = async (): Promise<void> => {
  try {
    await db.initialize();
    console.log("Database successfully initialized");
  } catch (e: any) {
    console.log(`Database failed to connect ${e.message}`);
  }
};

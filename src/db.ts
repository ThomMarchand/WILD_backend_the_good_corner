import { DataSource } from "typeorm";

const db = new DataSource({
  type: "sqlite",
  database: "the_good_corner.sqlite",
  entities: ["src/entities/*.ts"],
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

import "reflect-metadata";
import express, { Request, Response } from "express";
import cors from "cors";
import { In, Like } from "typeorm";
import { validate } from "class-validator";

import db from "./src/config/db";
import Ad from "./src/entities/Ad";
import Category from "./src/entities/Category";
import Tag from "./src/entities/Tag";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/ad", async (req: Request, res: Response) => {
  try {
    const { categoryId, adId, tagIds, name } = req.query;
    const requestId =
      typeof adId === "string" && adId.length > 0 ? parseInt(adId) : undefined;
    const catId =
      typeof categoryId === "string" && categoryId.length > 0
        ? parseInt(categoryId)
        : undefined;
    const tId =
      typeof tagIds === "string" && tagIds.length > 0
        ? tagIds.split(",").map((t) => parseInt(t, 10))
        : undefined;
    const reqName = typeof name === "string" ? name : undefined;

    const ads = await Ad.find({
      relations: { category: true },
      where: {
        id: requestId,
        // title: Like(`%${reqName}%`),
        category: {
          id: catId ? catId : undefined,
        },
        tags: {
          id: tId ? In(tId) : undefined,
        },
      },
    });

    res.status(200).send(ads);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get("/categories", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const categories = await Category.find({
      relations: {
        ads: true,
      },
      where: {
        type: category ? Like(`%${category}%`) : undefined,
      },
    });

    res.status(200).send(categories);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.get("/tags", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const tags = await Tag.find({
      where: { name: name ? Like(`%${name}%`) : undefined },
    });

    res.status(200).send(tags);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/ad", async (req, res) => {
  try {
    const newAd = await Ad.create(req.body);
    const errors = await validate(newAd);

    if (errors.length > 0) return res.status(422).send({ errors });

    const newAdSave = await newAd.save();

    res.status(200).send(newAdSave);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.post("/category", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    const errors = await validate(newCategory);

    if (errors.length > 0) return res.status(422).send({ errors });

    const newCategorySave = await newCategory.save();

    res.status(200).send(newCategorySave);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});
app.post("/tags", async (req: Request, res: Response) => {
  try {
    const newTag = Tag.create(req.body);
    const errors = await validate(newTag);

    if (errors.length > 0) return res.status(422).send({ errors });

    const newTagWithId = await newTag.save();

    res.send(newTagWithId);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

app.patch("/ad/:id", async (req, res) => {
  try {
    const adToUpdate = await Ad.findOneBy({ id: parseInt(req.params.id, 10) });

    if (!adToUpdate) return res.sendStatus(404);

    await Ad.merge(adToUpdate, req.body).save();

    const errors = await validate(adToUpdate);
    if (errors.length > 0) return res.status(422).send({ errors });

    res.status(200).send(await adToUpdate.save());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.delete("/ad/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedAd = await Ad.findOneBy({ id });

    if (!deletedAd) return res.status(404).send("not found");

    if (deletedAd !== null) {
      deletedAd.remove();
    }

    res.status(200).send("deleted is ok");
  } catch (e) {
    console.log(e);
  }
});

app.delete("/tags/:id", async (req: Request, res: Response) => {
  try {
    const tagToDelete = await Tag.findOneBy({
      id: parseInt(req.params.id, 10),
    });

    if (!tagToDelete) return res.sendStatus(404);

    await tagToDelete.remove();

    res.sendStatus(204);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(port, async () => {
  await db.initialize();
  console.log(`sever running on http://localhost:${port}`);
});

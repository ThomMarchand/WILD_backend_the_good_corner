import "reflect-metadata";
import express from "express";
import sqlite3 from "sqlite3";

import { dataSource } from "./src/config/db";
import { Ad } from "./src/entities/ad";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ad", async (req, res) => {
  try {
    const ads = await Ad.find();

    res.status(200).send(ads);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

app.get("/ad/:location", async (req, res) => {
  try {
    const location: string = req.params.location;

    const oneAd = await Ad.findBy({ location });

    if (!oneAd) return res.status(404).send("Not found");

    res.status(200).send(oneAd);
  } catch (e) {
    console.log(e);
  }
});

app.get("/ad/:id", async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);

    const oneAd = await Ad.findOneBy({ id });

    if (!oneAd) return res.status(404).send("Not found");

    res.status(200).send(oneAd);
  } catch (e) {
    console.log(e);
  }
});

app.post("/ad", async (req, res) => {
  try {
    const newAd = Ad.create(req.body);

    newAd.save();

    res.status(200).send(newAd);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});

app.patch("/ad/:id", async (req, res) => {
  try {
    const id: number = parseInt(req.params.id);

    const updatedAd = await Ad.findOneBy({ id });

    if (!updatedAd) return res.status(404).send("not found");

    if (updatedAd !== null) {
      updatedAd;
    }

    res.status(200).send(updatedAd);
  } catch (e) {
    console.log(e);
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

app.listen(port, async () => {
  await dataSource.initialize();
  console.log(`sever running on http://localhost:${port}`);
});

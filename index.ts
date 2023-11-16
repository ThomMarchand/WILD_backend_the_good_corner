import express from "express";
import sqlite3 from "sqlite3";

import { Ad } from "./type";

const app = express();
const port = 4000;

const db = new sqlite3.Database("the_good_corner.sqlite");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/ad", (req, res) => {
  db.all("SELECT * FROM ad", (err, rows) => {
    if (!err) return res.send(rows);
    console.log(err);
    res.sendStatus(500);
  });
});

app.get("/ad/:location", (req, res) => {
  db.all(
    "SELECT * FROM ad WHERE location= ?",
    [req.params.location],
    (err, rows) => {
      console.log(rows);

      if (!err) return res.send(rows);
      console.log(err);
      res.sendStatus(500);
    }
  );
});

app.get("/ad/:id", (req, res) => {
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);
    res.send(row);
  });
});

app.post("/ad", (req, res) => {
  const newAd: Ad = {
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  db.run(
    "INSERT INTO ad (title, owner, description, price, picture, location, createdAt) VALUES ($title, $owner, $description, $price, $picture, $location, $createdAt)",
    {
      $title: newAd.title,
      $owner: newAd.owner,
      $description: newAd.description,
      $price: newAd.price,
      $picture: newAd.picture,
      $location: newAd.location,
      $createdAt: newAd.createdAt,
    },
    function (this: any, err: any) {
      if (!err) return res.send({ ...newAd, id: this.lastID });
      console.log(err);
      res.sendStatus(500);
    }
  );
});

app.patch("/ad/:id", (req, res) => {
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);

    // creates a string with this shape : "title = $title, description = $description, ..."
    const setProps = Object.keys(req.body)
      .reduce<string[]>((acc, prop) => [...acc, `${prop} = $${prop}`], [])
      .join(", ");

    // creates an object with this shape : {$title: "title sent by client", "$description: " description sent by client", ...}
    const propsToUpdate = Object.keys(req.body).reduce(
      (acc, prop) => ({ ...acc, [`$${prop}`]: req.body[prop] }),
      {}
    );

    db.run(
      `UPDATE ad SET ${setProps} WHERE id = $id`,
      { ...propsToUpdate, $id: req.params.id },
      (err: any) => {
        if (!err) return res.send({ ...row, ...req.body });
        console.log(err);
        res.sendStatus(500);
      }
    );
  });
});

app.delete("/ad/:id", (req, res) => {
  db.get("SELECT * FROM ad WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (!row) return res.sendStatus(404);
    db.run("DELETE FROM ad WHERE id = ?", [req.params.id], (err: any) => {
      if (!err) return res.sendStatus(204);
      console.log(err);
      res.sendStatus(500);
    });
  });
});

app.listen(port, () => {
  console.log(`sever running on http://localhost:${port}`);
});

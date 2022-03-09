"use strict";

const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT ?? 8000;

function readFile(callback) {
  fs.readFile("pets.json", "utf-8", (err, data) => {
    if (err) {
      callback(err);
    }
    callback(null, JSON.parse(data));
  });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/pets/:index", (req, res) => {
  let index = req.params.index;
  readFile((err, petData) => {
    if (err) {
      res.status(500).send("Problem reading pets.json");
      return;
    }
    if (!index || !petData[index]) {
      res.status(404).send("Not found");
      return;
    }
    res.setHeader("Content-type", "application/json");
    res.json(petData[index]);
  });
});

app.get("/pets", (req, res) => {
  readFile((err, petData) => {
    if (err) {
      res.status(500).send("Problem reading pets.json");
      return;
    }

    res.setHeader("Content-type", "application/json");
    res.json(petData);
  });
});

app.post("/pets", (req, res) => {
  readFile((err, petData) => {
    if (err) {
      res.status(500).send("Problem reading pets.json");
      return;
    }
    let { age, name, kind } = req.body;
    if (name === "" || kind === "" || !Number.isInteger(age)) {
      res.status(400).send("Bad Request");
      return;
    }

    petData.push(req.body);
    fs.writeFile("pets.json", JSON.stringify(petData), "utf8", (err) => {
      if (err) {
        res.status(500).send("Problem writing to pets.json");
        return;
      }
      res.setHeader("Content-type", "application/json");
      res.send(req.body);
    });
  });
});

app.patch("/pets/:index", (req, res) => {
  let index = req.params.index;
  readFile((err, petData) => {
    if (err) {
      res.status(500).send("Problem reading pets.json");
      return;
    }
    if (!index || !petData[index]) {
      res.status(404).send("Not Found");
      return;
    }

    // patch logic
    if (req.body.name) {
      petData[index].name = req.body.name;
    }
    if (req.body.age && Number.isInteger(req.body.age)) {
      petData[index].age = req.body.age;
    }
    if (req.body.kind) {
      petData[index].kind = req.body.kind;
    }

    fs.writeFile("pets.json", JSON.stringify(petData), "utf8", (err) => {
      if (err) {
        res.status(500).send("Problem writing to pets.json");
        return;
      }
      res.send(JSON.stringify(petData[index]));
    });
  });
});

app.delete("/pets/:index", (req, res) => {
  let index = req.params?.index;
  let removed;
  readFile((err, petData) => {
    if (err) {
      res.status(500).send("Problem reading pets.json");
      return;
    }
    if (!index || !petData[index]) {
      res.status(404).send("Not found, pet does not exist at that index.");
      return;
    }
    removed = petData[index];
    petData = petData.slice(0, index).concat(petData.slice(index + 1));

    fs.writeFile("pets.json", JSON.stringify(petData), "utf8", (err) => {
      if (err) {
        res.status(500).send("Problem writing to pets.json");
        return;
      }
      res.setHeader("Content-type", "application/json");
      res.json(removed);
    });
  });
});

app.listen(port, () => {
  console.log("Listening on port", port);
});

module.exports = app;

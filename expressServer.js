"use strict";

const fs = require("fs");
const express = require("express");
const app = express();

const port = process.env.PORT ?? 8000;
const petRE = /^\/pets\/(.*)$/;

function readFile(callback) {
  fs.readFile("pets.json", "utf-8", (err, data) => {
    if (err) {
      callback(err);
    }
    callback(null, JSON.parse(data));
  });
}
app.get(petRE, (req, res) => {
  const index = req.url.match(petRE) === null ? "" : req.url.match(petRE)[1];
  readFile((err, petData) => {
    if (err) {
      res.statusCode = 500;
      res.statusMessage = "Problem reading pets.json";
      res.end();
      return;
    }
    if (!index || !petData[index]) {
      res.statusCode = 404;
      res.setHeader("Content-type", "text/plain");
      res.end("Not Found");
      return;
    }
    console.error(index);
    res.setHeader("Content-type", "application/json");
    res.write(JSON.stringify(petData[index]));
    res.end();
  });
});

app.get("/pets", (req, res) => {
  readFile((err, petData) => {
    if (err) {
      res.statusCode = 500;
      res.statusMessage = "Problem reading pets.json";
      res.end();
      return;
    }
    res.setHeader("Content-type", "application/json");
    res.write(JSON.stringify(petData));
    res.end();
  });
});

app.listen(port, () => {
  console.log("Listening on port", port);
});

module.exports = app;

"use strict";
const express = require("express");
const morgan = require("morgan");
const pg = require("pg")
const basicAuth = require('./auth')
require('dotenv').config();

const app = express();
const port = process.env.PORT ?? 8000;
const pool = new pg.Pool({
  database: 'petshop'
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(basicAuth)
app.get("/pets/:index", (req, res) => {
  let index = req.params.index;
  pool.query("SELECT * FROM pets WHERE id=$1", [index])
    .then(result => {
      if (result.rows[0].length === 0) {
        return res.json()
      }
      res.json(result.rows[0])
    }
    )
    .catch(err => console.error(err))
});

app.get("/pets", (req, res) => {
  pool.query('SELECT * FROM pets')
    .then(result => res.json(result.rows))
});

app.post("/pets", (req, res) => {
  const { name, age, kind } = req.body
  if (!Number.isInteger(age)) {
    return res.status(400).send("Invalid input, try again")
  }
  if (name.includes(';') || kind.includes(';')) {
    return res.status(400).send("no semicolons allowed")
  }

  pool.query('INSERT INTO pets (name, age, kind) VALUES ($1,$2,$3) RETURNING *', [name, age, kind])
    .then(result => res.json(result.rows[0]))
});

app.patch("/pets/:index", (req, res) => {
  let index = req.params.index;
  const { name, age, kind } = req.body
  if (!Number.isInteger(age)) {
    res.status(400).send("Invalid input, try again")
    return;
  }
  if (name.includes(';') || kind.includes(';')) {
    return res.status(400).send("no semicolons allowed")
  }
  const patchQ = ` 
    UPDATE pets SET
      name = COALESCE($1, name),
      age = COALESCE($2, age),
      kind = COALESCE($3, kind)
    WHERE id = $4
    RETURNING *
    `
  pool.query(patchQ, [name, age, kind, index])
    .then(result => res.json(result))
});

app.delete("/pets/:index", (req, res) => {
  let index = req.params.index;
  if (!Number.isInteger(index)) {
    res.status(400).send("Index is not an integer, try again")
    return;
  }
  pool.query('DELETE FROM pets WHERE id = $1 RETURNING *', [index])
    .then(result => res.json(result.rows[0]))
});

app.listen(port, () => {
  console.log("Listening on port", port);
});

function checkInput(string) {
  if (string.includes(';') !== -1) {
    res.status(400).send("no semicolons allowed")
  }
}

module.exports = app;

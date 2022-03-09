"use strict";
const fs = require("fs");
const express = require("express");
const morgan = require("morgan");
const pg = require("pg")

require('dotenv').config();

const app = express();
const port = process.env.PORT ?? 8000;
const pool = new pg.Pool({
  database: 'petshop'
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/pets/:index", (req, res) => {
  let index = req.params.index;
  pool.query("SELECT * FROM pets WHERE id=$1", [index])
    .then(result => res.json(result.rows[0]))
    .catch(err => console.error(err))
});

app.get("/pets", (req, res) => {
  pool.query('SELECT * FROM pets')
    .then(result => res.json(result.rows))
});

app.post("/pets", (req, res) => {
  const { name, age, kind } = req.body
  pool.query('INSERT INTO pets (name, age, kind) VALUES ($1,$2,$3)', [name, age, kind])
    .then(result => res.json(req.body))
});

app.patch("/pets/:index", (req, res) => {
  let index = req.params.index;
  const { name, age, kind } = req.body
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
  pool.query('DELETE FROM pets WHERE id = $1 RETURNING *', [index])
    .then(result => res.json(result.rows[0]))
});

app.listen(port, () => {
  console.log("Listening on port", port);
});

module.exports = app;

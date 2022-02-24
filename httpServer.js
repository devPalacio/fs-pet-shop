"use strict";

const fs = require("fs");
const http = require("http");

const petRE = /^\/pets\/(.*)$/;

let petData;
try {
  petData = JSON.parse(fs.readFileSync("pets.json", "utf8"));
} catch (err) {
  console.error(err);
  process.exit(1);
}
// console.log(petData);
const port = process.env.PORT ?? 8000;

const server = http.createServer((req, res) => {
  // console.log(req.url);
  const index = req.url.match(petRE) === null ? "" : req.url.match(petRE)[1];

  if (req.method === "GET" && req.url === "/pets") {
    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(petData));
    return;
  }
  if (req.method === "GET" && index !== "") {
    // check if index is valid
    if (!petData[index]) {
      res.statusCode = 404;
      res.setHeader("Content-type", "text/plain");
      res.end("Not Found");
      return;
    }

    res.setHeader("Content-type", "application/json");
    res.end(JSON.stringify(petData[index]));
    return;
  }

  res.setHeader("Content-Type", "text/plain");
  res.end("Not Found");
});

server.listen(port, () => {
  console.log("Listening on port", port);
});

module.exports = server;

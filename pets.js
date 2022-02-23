"use strict";
const fs = require("fs");

console.log(process.argv);
if (process.argv.length < 3) {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}
if (process.argv[2].toLowerCase() === "read") {
  fs.readFile("pets.json", "utf8", function (error, data) {
    if (error) {
      return console.error(error);
    }
    console.log(JSON.parse(data));
  });
}

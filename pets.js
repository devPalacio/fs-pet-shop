"use strict";
const fs = require("fs");
const command = process.argv?.[2]?.toLowerCase();
const commands = { read: null, create: null, update: null, destroy: null };

if (process.argv.length < 3 || !(command in commands)) {
  console.error("Usage: node pets.js [read | create | update | destroy]");
  process.exit(1);
}

const index = process.argv[3];
let petData;

try {
  petData = JSON.parse(fs.readFileSync("pets.json", "utf8"));
} catch (err) {
  return console.error(err);
}

if (command === "read") {
  read();
}

if (command === "create") {
  create();
}

function read() {
  if (index !== undefined) {
    if (!petData[+index]) {
      console.error(`Usage: node pets.js read INDEX (index out of bounds)`);
      process.exit(1);
    }
    return console.log(petData[+index]);
  }
  return console.log(petData);
}

function create() {
  if (process.argv.length < 6) {
    console.error("Usage: node pet.js create AGE KIND NAME");
    process.exit(1);
  }
  let newPet = {};
  newPet.age = +process.argv[3];
  newPet.kind = process.argv[4];
  newPet.name = process.argv[5];
  petData.push(newPet);
  fs.writeFile("pets.json", JSON.stringify(petData, "utf8"), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.info(`Wrote ${newPet} to file`);
  });
}

//function readFile() {
//  fs.readFile(process.argv[1], "utf8", function (error, data) {
//    if (error) {
//      return console.error(error);
//    }
//
//    return data;
//  });
//}

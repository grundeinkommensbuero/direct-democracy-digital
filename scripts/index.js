#!/usr/bin/env node
const setup = require("./general-setup");
const deploy = require("./general-deploy");

const command = process.argv.slice(2)[0];

if (command === "setup" || command === "init") {
  setup();
} else if (command === "deploy") {
  deploy();
} else {
  console.log(`Command ${command} not found. Did you mean setup or deploy?`);
}

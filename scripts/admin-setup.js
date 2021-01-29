#!/usr/bin/env node
const shell = require("shelljs");

const run = async () => {
  // Create directory for admin panel
  shell.rm("-r", `${process.cwd()}/admin`);
  shell.mkdir(`${process.cwd()}/admin`);

  // Copy templates for admin react project
  shell.cp("-r", `${__dirname}/../templates/admin`, `${process.cwd()}`);

  // Install npm modules
  shell.cd(`${process.cwd()}/admin`);
  shell.exec("yarn install");
};

run();

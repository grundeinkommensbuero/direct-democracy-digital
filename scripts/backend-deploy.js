const shell = require("shelljs");

const run = async () => {
  // Execute backend deploy script (using backend module)
  shell.cd(`${process.cwd()}/backend`);
  shell.exec("yarn run deploy");
};

run();

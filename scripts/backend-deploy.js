const shell = require("shelljs");
const { execSync } = require("child_process");

const run = async () => {
  // Execute backend deploy script (using backend module)
  shell.cd(`${process.cwd()}/backend`);

  // We need to use exec sync because shell.exec does not work with input
  execSync("yarn run deploy", { stdio: "inherit" });
};

run();

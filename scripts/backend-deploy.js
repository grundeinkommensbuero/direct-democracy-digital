const shell = require("shelljs");
const { execSync } = require("child_process");

const run = async () => {
  // Execute backend deploy script (using backend module)
  shell.cd(`${process.cwd()}/backend`);

  // Copy config file into backend module
  const copyResult = shell.cp(
    "config.json",
    "node_modules/backend-direct-democracy/config.json"
  );

  // Copy unsuccessul, probably because file does not exist yet
  if (copyResult.stderr) {
    console.log("No config exists yet, credentials will be prompted...");
  }

  // We need to use exec sync because shell.exec does not work with input
  execSync("yarn run deploy", { stdio: "inherit" });
};

run();

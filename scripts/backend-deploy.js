const shell = require("shelljs");
const { execSync } = require("child_process");
const secretsPath = `${process.cwd()}/secrets.json`;
const stackOutputPath = `${process.cwd()}/backend/stack.json`;
const fs = require("fs");

module.exports = async () => {
  try {
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

    // Move content of stack output to secrets.json by consolidating the stack output
    // and the existing secrets
    const secrets = JSON.parse(fs.readFileSync(secretsPath, "utf8"));
    const stack = JSON.parse(fs.readFileSync(stackOutputPath, "utf8"));

    const mergedJson = { ...stack, ...secrets };

    // Save merged json to file
    fs.writeFileSync(secretsPath, JSON.stringify(mergedJson));

    // Remove stack.json
    shell.rm(stackOutputPath);

    shell.cd("..");
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

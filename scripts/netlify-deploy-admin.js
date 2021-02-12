const shell = require("shelljs");
const { execSync } = require("child_process");
const path = require("path");

module.exports = async () => {
  try {
    console.log("Deploying admin panel, this might take a few minutes...");

    // Copy campaign configuration into admin module
    shell.cp(
      "campaigns.json",
      "admin/node_modules/admin-direct-democracy/dist/campaigns.json"
    );

    shell.cd("admin");

    // Define the netlify executable path
    const runNetlify = path.resolve(
      `${__dirname}/../node_modules/.bin/netlify`
    );

    // Build
    // 1. Netlify
    // shell.exec(`${runNetlify} build`);
    // OR
    // 2. Gatsby
    shell.exec(`yarn build`);

    // Login
    execSync(`${runNetlify} login --new`, {
      stdio: "inherit",
    });

    // Deploy
    execSync(`${runNetlify} deploy --dir=build --prod`, {
      stdio: "inherit",
    });

    shell.cd("..");
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

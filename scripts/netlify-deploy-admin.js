const shell = require("shelljs");
const { execSync } = require("child_process");
const path = require("path");

const run = async () => {
  try {
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
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

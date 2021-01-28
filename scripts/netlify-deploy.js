const shell = require("shelljs");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "hasMultipleContentfulAccounts",
      type: "confirm",
      message:
        "Do you have multiple contentful accounts? (We’ll log you out of existing contentful accounts so you can make sure the right one will be used)",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Choose an option";
      },
    },
  ]);
};

const run = async () => {
  try {
    const { hasMultipleContentfulAccounts } = await promptConfig();

    // Install netlify-cli locally
    shell.exec(`yarn workspace site add --dev netlify-cli`);

    // Change the directory (netlify-cli needs this for the site link in .netlify)
    shell.exec(`cd site`);
    // Define the netlify executable path
    const runNetlify = `node ${process.cwd()}/node_modules/.bin/netlify`;

    // Login
    execSync(`${runNetlify} login --new`, {
      stdio: "inherit",
    });

    // Import .env variables
    shell.exec(`${runNetlify} env:import .env.production --replaceExisting`);

    // Build
    // 1. Netlify
    shell.exec(`${runNetlify} build`);
    // OR
    // 2. Gatsby
    // shell.exec(`yarn gatsby build`);

    // Deploy
    execSync(`${runNetlify} deploy --prod`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

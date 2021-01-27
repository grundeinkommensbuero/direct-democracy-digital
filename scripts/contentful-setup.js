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
    {
      name: "useExistingSpace",
      type: "confirm",
      message:
        "Do you have an existing contentful space you want to use? – Warning: All content will be overwritten! (Hint: If you reached the space limit of your contentful plan, 1 in a free plan, you won’t be able to create another one)",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Choose an option";
      },
    },
    {
      name: "organizationName",
      type: "input",
      when: ({ useExistingSpace }) => {
        return !useExistingSpace;
      },
      message:
        "Enter a name for your contentful space. Could be your organization’s name or just 'main'.",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter the name of your contentful space.";
      },
    },
  ]);
};

const run = async () => {
  try {
    const {
      hasMultipleContentfulAccounts,
      useExistingSpace,
      organizationName,
    } = await promptConfig();

    shell.exec(`yarn add --dev contentful-cli`);

    const runContentful = `node ${process.cwd()}/node_modules/.bin/contentful`;

    // Safety logout
    if (hasMultipleContentfulAccounts) {
      execSync(`${runContentful} logout`, {
        stdio: "inherit",
      });
    }

    // Login to contentful
    execSync(`${runContentful} login`, {
      stdio: "inherit",
    });

    if (!useExistingSpace) {
      // Create a new space
      execSync(`${runContentful} space create --name ${organizationName}`, {
        stdio: "inherit",
      });
    }

    // Set as default space
    console.log("Confirm the space you want to import the starter content to:");
    execSync(`${runContentful} space use`, {
      stdio: "inherit",
    });

    // Import the contentful starter json file
    execSync(
      `${runContentful} space import --content-file ${__dirname}/../configs/contentful-starter.json --environment-id master`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

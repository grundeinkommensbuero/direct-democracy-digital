const shell = require("shelljs");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "useExistingSpace",
      type: "confirm",
      message:
        "Do you have an existing contentful space you want to use? – Warning: All content will be overwritten!",
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
        "Enter a name for your contentful space. Could be your organization’s name or just 'main'",
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
    const { useExistingSpace, organizationName } = await promptConfig();

    // Login to contentful
    execSync(`npx contentful login`, { stdio: "inherit" });

    if (!useExistingSpace) {
      // Create a new space
      execSync(`npx contentful space create --name ${organizationName}`, {
        stdio: "inherit",
      });
    }

    // Set as default space
    console.log("Confirm the space you want to import the starter content to:");
    execSync(`npx contentful space use`, { stdio: "inherit" });

    // Import the contentful starter json file
    execSync(
      `npx contentful space import --content-file ${__dirname}/../configs/contentful-starter.json --environment-id master`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

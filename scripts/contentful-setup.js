const shell = require("shelljs");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "managementToken",
      type: "password",
      message: "Enter your contentful management token / private access token.",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please your contentful management token / private access token.";
      },
    },
    {
      name: "organizationName",
      type: "input",
      message: "Enter the name of your organization",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter the name of your organization.";
      },
    },
  ]);
};

const run = async () => {
  try {
    const { managementToken, organizationName } = await promptConfig();

    // Create a new space
    execSync(
      `npx contentful space create --name ${organizationName} --management-token ${managementToken}`,
      { stdio: "inherit" }
    );

    // Set as default space
    console.log(
      "Confirm the space you just created as your default contentful space:"
    );
    execSync(`npx contentful space use`, { stdio: "inherit" });

    // Import the contentful starter json file
    execSync(
      `npx contentful space import --content-file ${__dirname}/../configs/contentful-starter.json`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

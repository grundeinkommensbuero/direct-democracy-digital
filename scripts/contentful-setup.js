const shell = require("shelljs");
const inquirer = require("inquirer");
const { exec, execSync, fork, spawnSync } = require("child_process");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const secretsPath = `${__dirname}/../configs/secrets.json`;
const envPath = `${process.cwd()}/site/.env`;

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
    // Prompt
    const {
      hasMultipleContentfulAccounts,
      useExistingSpace,
      organizationName,
    } = await promptConfig();

    const runContentful = path.resolve(
      `${__dirname}/../node_modules/.bin/contentful`
    );

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

    // Get the spaceId and the management token
    const config = shell.exec(`${runContentful} config list`, { silent: true })
      .stdout;

    // Note: temporarily log the stdout
    console.log("CHECK if output makes sense", config);

    const contentfulSpaceId = config
      .match(/activeSpaceId:\s\S+/gm)[0]
      .replace(/activeSpaceId:\s/, "");
    const managementToken = config
      .match(/managementToken:\s\S+/gm)[0]
      .replace(/managementToken:\s/, "");

    // Create the contentful access token
    // https://www.contentful.com/developers/docs/references/content-management-api/#/reference/api-keys

    const request = {
      method: "POST",
      body: JSON.stringify({
        name: `Direct Democracy API Key`,
        environments: [
          {
            sys: {
              type: "Link",
              linkType: "Environment",
              id: "staging",
            },
          },
        ],
      }),
      headers: {
        "Content-Type": "application/vnd.contentful.management.v1+json",
        Authorization: `Bearer ${managementToken}`,
      },
    };

    const response = await fetch(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/api_keys`,
      request
    );

    // First run of the script
    // Success is status code 201.
    console.log(response.status);

    if (response.status === 201) {
      const apiKeyData = await response.json();
      const contentfulAccessToken = apiKeyData.accessToken;
      const apiKeyId = apiKeyData.sys.id;
      const contentfulEnvironment = "master";

      const secrets = {
        contentfulAccessToken,
        apiKeyId,
        contentfulSpaceId,
        contentfulEnvironment,
      };
      fs.writeFileSync(secretsPath, JSON.stringify(secrets));
      writeEnvVariables(secrets);
      console.log(
        "Success: contentful space id and access token have been created"
      );
      // Second and consecutive runs of the script
    } else {
      // Response status code 422 indicates that a token with this name
      // has already been set for this space.
      // In this case we don’t want recreate another access token or delete and recreate this one.
      // We just read the token and related variables
      // from the backup copy in configs/secrets.json
      let secretsRaw;
      try {
        secretsRaw = fs.readFileSync(secretsPath, "utf8");
      } catch {
        throw "Error: Could not create contentful access token and couldn’t find backup copy. Please reset your contentful setup according to the documentation and restart this process.";
      }
      const secrets = JSON.parse(secretsRaw);
      if (
        // Really making sure the spaceId matches the currently selected space
        // (only for edge cases)
        secrets.contentfulSpaceId === contentfulSpaceId
      ) {
        if (secrets.contentfulAccessToken) {
          console.log(
            "Success: contentful space id and access token have already been set"
          );
          // Note: I omitted re-writing the .env-file here.
          // We need to make sure the .env-file is recreated in the same fashion after multiple runs of the scripts
          // especially when integrating this script with others that need to access the .env-file
        } else {
          throw "Error: Your contentful access token could not be created and a previous version could not be retrieved. Please reset your contentful setup according to the documentation and restart this process.";
        }
      } else {
        throw "Error: There has been a mismatch in your contentful space ids. Please reset your contentful setup according to the documentation and restart this process.";
      }
    }
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

// Note: The function to write the .env file probably has to be adjusted
// to match the process of the other scripts when executing them in order
// (also needs to consider re-runs, so appending might not be the best way)
// Suggestion: one secrets.json-file that keeps track of the variables
// and a utils.js file with exports for writing the .env variables, for frontend, backend, admin-panel respectively
const writeEnvVariables = (secrets) => {
  const {
    contentfulAccessToken,
    contentfulSpaceId,
    contentfulEnvironment,
  } = secrets;
  const envVariables = `CONTENTFUL_SPACE_ID='${contentfulSpaceId}'\nCONTENTFUL_ACCESS_TOKEN='${contentfulAccessToken}'\nCONTENTFUL_ENVIRONMENT='${contentfulEnvironment}'`;
  fs.appendFileSync(envPath, envVariables);
};

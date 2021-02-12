const inquirer = require("inquirer");
const fs = require("fs");
const campaignConfigPath = `${process.cwd()}/campaigns.json`;
const setupGatsbyTheme = require("./gatsby-theme-setup");
const setupContentful = require("./contentful-setup");
const setupAdmin = require("./admin-setup");
const setupBackend = require("./backend-setup");

const run = async () => {
  try {
    // We need a project name for the serverless module
    const { projectName } = await promptProjectName();

    await setupGatsbyTheme();
    const campaigns = await createCampaignConfig(); // Prompt user for campaign config
    await setupContentful();
    await setupAdmin();
    await setupBackend(projectName, campaigns);
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

const createCampaignConfig = async () => {
  let anotherOne = true;
  const campaigns = [];

  while (anotherOne) {
    const config = await promptConfig();
    campaigns.push({
      name: config.name,
      round: config.round,
      campaignCodeInContentful: `${config.name}-${config.round}`,
    });

    anotherOne = config.anotherOne;
  }

  // Save campaign config to working dir
  fs.writeFileSync(campaignConfigPath, JSON.stringify({ campaigns }));

  console.log(
    "Successfully saved campaign configuration to file campaigns.json."
  );

  return campaigns;
};

const promptProjectName = () => {
  return inquirer.prompt([
    {
      name: "projectName",
      type: "input",
      message: 'Please enter a name for the project (e.g. "radentscheid")',
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter a name.";
      },
    },
  ]);
};

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "name",
      type: "input",
      message:
        'Please enter a name for the campaign (a word, which uniquely identifies this campaign, e.g. "radentscheid", "berlin" or "hamburg") You can define another campaign later.',
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter a name.";
      },
    },
    {
      name: "round",
      type: "list",
      message:
        "In which phase of signature collection is this campaign currently? If there is only one phase, choose 1.",
      choices: [
        {
          name: "1",
          value: 1,
          short: "1",
        },
        {
          name: "2",
          value: 2,
          short: "2",
        },
      ],
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Choose an option";
      },
    },
    {
      name: "anotherOne",
      type: "confirm",
      message:
        "Would you like to add another campaign? You can always add campaigns later on by editing the config file and redeploying.",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Choose an option";
      },
    },
  ]);
};

run();

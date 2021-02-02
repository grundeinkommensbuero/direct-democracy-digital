const inquirer = require("inquirer");
const fs = require("fs");
const campaignConfigPath = `${process.cwd()}/campaigns.json`;

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "name",
      type: "input",
      message:
        'Please enter a name for the campaign (a word, which uniquely identifies this campaign, e.g. "radentscheid", "berlin" or "hamburg")',
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

const run = async () => {
  try {
    let anotherOne = true;
    const campaigns = [];

    while (anotherOne) {
      const config = await promptConfig();
      campaigns.push({
        name: config.name,
        round: config.round,
      });

      anotherOne = config.anotherOne;
    }

    // Save campaign config to working dir
    fs.writeFileSync(campaignConfigPath, JSON.stringify(campaigns));

    console.log(
      "Successfully saved campaign configuration to file campaigns.json."
    );
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

run();

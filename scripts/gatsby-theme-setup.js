const shell = require("shelljs");
const inquirer = require("inquirer");

const promptConfig = () => {
  return inquirer.prompt([
    {
      name: "siteUrl",
      type: "input",
      message: "Enter the url of your website:",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter your website url.";
      },
    },
    {
      name: "packageName",
      type: "input",
      message: "Enter name of your website package:",
      validate: (value) => {
        if (value.length > 0) {
          return true;
        }

        return "Please enter your website package name.";
      },
    },
  ]);
};

const createGatsbyConfig = ({ siteUrl }) => {
  return `module.exports = {
    plugins: [
      {
        resolve: "gatsby-theme-direct-democracy",
        options: {
          siteUrl: "${siteUrl}",
        },
      },
    ],
  };`;
};

const createPackageJSON = ({ packageName }) => {
  return `{
    "private": true,
    "name": "${packageName}",
    "version": "1.0.0",
    "license": "MIT",
    "scripts": {
      "build": "gatsby build",
      "develop": "gatsby develop",
      "clean": "gatsby clean"
    }
  }`;
};

const run = async () => {
  try {
    const { siteUrl, packageName } = await promptConfig();

    const gatsbyConfig = createGatsbyConfig({ siteUrl });
    const packageJSON = createPackageJSON({ packageName });

    // Create site & src & gatsby shadowing folder
    shell.mkdir(
      "-p",
      `${process.cwd()}/site/src/gatsby-theme-direct-democracy`
    );

    shell.cp(
      `${__dirname}/../configs/README.md`,
      `${process.cwd()}/site/src/gatsby-theme-direct-democracy`
    );

    // Copy eslint config
    shell.cp(`${__dirname}/../configs/.eslintrc.js`, `${process.cwd()}/site`);

    // Write config to js file
    new shell.ShellString(gatsbyConfig).to(
      `${process.cwd()}/site/gatsby-config.js`
    );

    // Write package.json to to file
    new shell.ShellString(packageJSON).to(`${process.cwd()}/site/package.json`);

    // Install npm modules
    shell.cd(`${process.cwd()}/site`);
    shell.exec("yarn add react react-dom gatsby gatsby-theme-direct-democracy");
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

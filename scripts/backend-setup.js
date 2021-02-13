const shell = require("shelljs");

const createPackageJSON = (packageName) => {
  return `{
    "private": true,
    "name": "${packageName}",
    "version": "1.0.0",
    "license": "MIT",
    "scripts": {
      "deploy": "direct-democracy-deploy-backend"
    }
  }`;
};

module.exports = async (projectName) => {
  try {
    // Create directory for backend
    shell.mkdir(`${process.cwd()}/backend`);

    const packageJSON = createPackageJSON("backend");

    // Write package.json to to file
    new shell.ShellString(packageJSON).to(
      `${process.cwd()}/backend/package.json`
    );

    // Write project name to to file
    new shell.ShellString(JSON.stringify({ projectName })).to(
      `${process.cwd()}/backend/config.json`
    );

    // Install npm module
    shell.cd(`${process.cwd()}/backend`);
    shell.exec("npm install backend-direct-democracy");

    shell.cd("..");
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

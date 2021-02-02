const shell = require("shelljs");

const createPackageJSON = ({ packageName }) => {
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

const run = async () => {
  // Create directory for backend
  shell.mkdir(`${process.cwd()}/backend`);

  // TODO get package name
  const packageJSON = createPackageJSON({ packageName: "blub" });

  // Write package.json to to file
  new shell.ShellString(packageJSON).to(
    `${process.cwd()}/backend/package.json`
  );

  // Install npm module
  shell.cd(`${process.cwd()}/backend`);
  shell.exec("yarn add backend-direct-democracy");
};

run();

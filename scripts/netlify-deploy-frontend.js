const shell = require("shelljs");
const { execSync } = require("child_process");
const path = require("path");

const run = async () => {
  try {
    // Change the directory (netlify-cli needs this for the site link in .netlify)
    shell.cd("site");

    // Define the netlify executable path
    const runNetlify = path.resolve(
      `${__dirname}/../node_modules/.bin/netlify`
    );

    // NOTE: or future improvement, if we want to use a netlify.toml file
    // we need to be careful the path will always be correct here –
    // netlify-cli reads the base dir in the toml always as a relative path to the project root
    // which is probably different for testing than it is in use later

    // Copy the netlify.toml config file
    // shell.cp("-r", `${__dirname}/../configs/netlify.toml`, `${process.cwd()}`);
    // const projectFolder = shell.exec("echo ${PWD##*/}").stdout;
    // console.log("projectFolder: ", projectFolder.trim());

    // shell.sed(
    //   "-i",
    //   "BASE_DIR",
    //   `/${projectFolder}/site`,
    //   `${process.cwd()}/netlify.toml`
    // );
    // End of netlify.toml config

    // NOTE: for continous deployment we can import an .env-file to netlify like this:
    // // Import .env variables
    // shell.exec(`${runNetlify} env:import .env.production --replaceExisting`);

    // Login
    execSync(`${runNetlify} login --new`, {
      stdio: "inherit",
    });

    // Build
    // 1. Netlify
    // shell.exec(`${runNetlify} build`);
    // OR
    // 2. Gatsby
    shell.exec(`yarn build`);

    // Deploy
    execSync(`${runNetlify} deploy --dir=public --prod`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};
run();

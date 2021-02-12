const shell = require("shelljs");

module.exports = async () => {
  try {
    // Create directory for admin panel
    shell.rm("-r", `${process.cwd()}/admin`);
    shell.mkdir(`${process.cwd()}/admin`);

    // Copy templates for admin react project
    shell.cp("-r", `${__dirname}/../templates/admin`, `${process.cwd()}`);

    // Install npm modules
    shell.cd(`${process.cwd()}/admin`);
    shell.exec("yarn install");

    shell.cd("..");
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

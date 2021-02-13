const deployBackend = require("./backend-deploy");
const deployFrontend = require("./netlify-deploy-frontend");
const deployAdmin = require("./netlify-deploy-admin");
const fs = require("fs");

const secretsPath = `${process.cwd()}/secrets.json`;
const frontendEnvPath = `${process.cwd()}/site/.env.production`;
const adminEnvPath = `${process.cwd()}/admin/.env.production`;

module.exports = async () => {
  try {
    await deployBackend();

    // Create file with env variables
    // We need to get the values of the secrets.json
    const secrets = JSON.parse(fs.readFileSync(secretsPath, "utf8"));
    writeEnvVariables(secrets);

    // Now that we have the env variables set up we can deploy
    // both frontend and admin panel
    await deployFrontend();
    await deployAdmin();
  } catch (error) {
    console.log("Ooops, something went wrong", error);
  }
};

// Takes object as param and writes .env files into site and admin folders
const writeEnvVariables = (secrets) => {
  const {
    contentfulAccessToken,
    contentfulSpaceId,
    contentfulEnvironment,
    userPoolId,
    adminUserPoolId,
    userPoolClientId,
    adminUserPoolClientId,
    endpointUrl,
    region,
  } = secrets;

  const frontendEnvVariables = `
  CONTENTFUL_SPACE_ID='${contentfulSpaceId}'
  CONTENTFUL_ACCESS_TOKEN='${contentfulAccessToken}'
  CONTENTFUL_ENVIRONMENT='${contentfulEnvironment}'
  COGNITO_APP_CLIENT_ID='${userPoolClientId}'
  COGNITO_USER_POOL_ID='${userPoolId}'
  COGNITO_REGION='${region}'
  API_URL='${endpointUrl}'
  `;

  const adminEnvVariables = `
  REACT_APP_COGNITO_CLIENT_ID='${adminUserPoolClientId}'
  REACT_APP_COGNITO_USER_POOL_ID='${adminUserPoolId}'
  REACT_APP_COGNITO_REGION='${region}'
  REACT_APP_API_URL='${endpointUrl}'
  `;

  fs.writeFileSync(frontendEnvPath, frontendEnvVariables);
  fs.writeFileSync(adminEnvPath, adminEnvVariables);
};

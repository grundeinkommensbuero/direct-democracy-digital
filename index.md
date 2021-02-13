# :loudspeaker::pencil: Direct Democracy Digital 

## Overview

The project *Direct Democracy Digital* offers a tool to create your own platform supporting your campaign of direct democracy. The tool is mostly geared towards initiatives in Germany as it was built upon the web application used by [Expedition Grundeinkommen](https://expedition-grundeinkommen.de/). To see what the result of setting up our tool looks like you can examine a working demo [here](https://direkte-demokratie.netlify.app/). The project was supported by [Protoype Fund](https://prototypefund.de/) and developed by the team at Expedition Grundeinkommen.

## NPM module(s)

The project is built around several npm modules which are brought the together in the [Direct Democracy Digital repo](https://github.com/grundeinkommensbuero/direct-democracy-digital), which includes scripts to configure and deploy the individual modules: 

- [Gatsby Theme](https://github.com/grundeinkommensbuero/gatsby-theme)
- [Admin Panel](https://github.com/grundeinkommensbuero/admin)
- [Backend service](https://github.com/grundeinkommensbuero/backend)

## Prerequisites

### AWS Account

#### Create Account

If you already have an AWS account you can skip this step.

Since our backend service uses a serverless architecture using AWS (Lambda, DynamoDB, Cognito, S3, SES), an AWS account needs to be created and configured beforehand. Instructions on how to create an account can be found here: [Create and activate a new AWS account](https://aws.amazon.com/de/premiumsupport/knowledge-center/create-and-activate-aws-account/)

The use the AWS cloud services will cost depending on usage. For details see the pricing pages for: [DynamoDB](https://aws.amazon.com/dynamodb/pricing/provisioned/), [Cognito](https://aws.amazon.com/cognito/pricing/?nc1=h_ls), [SES](https://aws.amazon.com/ses/pricing/?nc1=h_ls).

Up until 50.000 active users per month the costs will be minimal. Due to the pricing structure of Cognito (the user management service) the costs get higher quickly after that. For most campaigns this should not be relevant though. 

For under 50.000 users the costs should not be higher than 50€ per month. 



#### SES

For now we only support the region eu-central-1 so be sure to do all of your configuration in that region. 

Because we are using AWS SES (Simple Email Service) to send out transactional mails, you need to configure the service in the aws console: console.aws.amazon.com/ses

You need to verify a sender address. You can either verify an entire domain (Identity Management -> domains) or just one address (Identity Managment -> Email Addresses) . During the setup of our service we will prompt you for this address. 

After creating an new AWS account, the SES account is still in sandbox mode, meaning you cannot yet send emails to addresses that are not verified. You can request to get out of sandbox mode by editing your account details on the page Sending Statistics. In the editing windowd choose Enable Production Access "Yes" and fill out the rest of the form. The mail type should be "transactional". For the use case you can write something along the lines of: 

"Our website supports a campaign of direct democracy by engaging with users and offering them tools to support our campaign. Users can sign up for our service on our website. If they no longer want to be notified they can delete their account on the website. We will handle complaints by deactivating mails to those accounts."

For further reference you can look at the AWS documentation: [Moving out of the Amazon SES sandbox](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html)

#### Get credentials

When configuring our tool you will be asked for your AWS credentials so we can automatically deploy the backend service. To generate AWS credentials you need to create a User with admin access in the [IAM Console](https://console.aws.amazon.com/iam/home?region=eu-central-1#/users). When asked for access type choose "Programmatic Access". For permissions choose "Administrator Access" under "Attach existing policies directly". 

After successfully creating the IAM user, credentials will be shown on screen. Safe them for later. 

For further reference see the AWS documentation: [Creating IAM users](https://docs.aws.amazon.com/de_de/IAM/latest/UserGuide/id_users_create.html#id_users_create_console)


### Netlify

We automatically deploy the frontend and the admin panel to Netlify, a hosting service for web applications and static websites. You need to create a Netlify account before setting up and deploying our tool. If you already have an account, you can skip this step. You can sign up for Netlify [here](https://app.netlify.com/signup/). When asked to choose a plan you can opt for "Starter". The Netlify service will therefore be free. 

### Contentful

We use Contentful as a preconfigured content management system (CMS). If you already have a Contentful account you can skip this step. Otherwise create an account [here](https://www.contentful.com/sign-up/). The default account is created with a community pricing plan, which means that the use of Contentful will also be free. 

## Deploy CLI

## AWS

## Contentful

### Export/import

#### Export (Dev process)

* [Contentful documentation export/import](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/)
* [Contentful documentation space management](https://www.contentful.com/developers/docs/tutorials/cli/space-management/)

To export the contentful data we have to log in as XBGE.

``` bash
contentful login
```

```bash
contentful space export --config contentful-export-config.json
```

The settings in the `contentful-export-config.json` are:

```json
{
    "spaceId": "af08tobnb0cl",
    "environmentId": "",
    "skipContent": true,
    "skipRoles": true,
    "skipWebhooks": true,
    "download-assets": false,
    "contentFile": "contentful-direct-democracy.json",
    "errorLogFile": "contentful-cli-errors.json"
}
```

- Our spaceId
- The environmentId is empty -> defaults to master. Only change if needed
- The file in which the data should be stored: `contentful-direct-democracy.json`
- Skips the following data:
  - Content */ remove when the white-label-version exists*
  - Roles
  - Webhooks
  - Assets




After we have to sign out again
```bash
contentful logout
```

##### Dev process questions: 

> * For the contentful export do we need a white-label version of the contents as well? –> Would make sense so the graphQL queries work in the frontend (or we need another solution for that)
> * How do we want to do the integration in the larger CLI? -> Ask to create personal access token and look up space id in the web app.
> * Do we need a separate development environment for the users, too? -> Just describe the option in the documentation
> * Can we use the contentful cli to create an api token and webhooks for netlify? -> For access token: not the very first one, for the webhook: yes!
> * Language for starter content
> * Tone / descriptiveness of starter content
> * Which features will be supported


#### Import (User process)

[Install the contentful cli](https://www.contentful.com/developers/docs/tutorials/cli/installation/)

To import the contentful data you need to login. 

``` bash
contentful login
```
You need to create a new space, ideally with the name of your organization.

```bash
contentful space create --name <your-organization>
```

The next command ensures all following commands use the space you just created: When prompted just select the space that you just created.

```bash
contentful space use 
```

> Note: We probably want the user to do few steps in the web app anyway so we could also ask for the <SPACE_ID> in a prompt and save it in the Configstore. Then we don’t need this extra step

This imports the data of the direct-democracy starter

```bash
contentful space import --content-file contentful-direct-democracy.json --config contentful-import-config.json
```

The settings in the `contentful-import-config.json` are:

```json
{
    "contentModelOnly": true,
    "skipLocales": true
}
```

- environmentId is not used -> defaults to master. Only change if needed
- Only imports the content model */ remove when we have a white-label-version*
- Does not import the locale settings



### Configuration

#### API tokens

* [Contentful documentation personal access tokens](https://www.contentful.com/help/personal-access-tokens/#how-to-get-a-personal-access-token-api-endpoints)

> It’s possible to create a personal access token via the API but some Authorization token is needed for this already -> we probably want to ask the user to create a personal access token in the web app and prompt in the CLI for the <SPACE-ID> and the <API-KEY>. 

> ```bash
> # Just in case we you want to creat a personal access token via the API:
> curl -X POST https://api.contentful.com/users/me/access_tokens \
>    -d '{"name": "<NAME>", "scopes": ["content_management_manage"]}' \
>    -H 'Authorization: Bearer <API_KEY>' \
>    -H 'Content-Type: application/vnd.contentful.management.v1+json'
> ```


#### Webhooks

* [Contentful documentation webhooks](https://www.contentful.com/developers/docs/concepts/webhooks/)

To create a webhook for netlify you can send a POST request to the conentful spaces API

```bash
curl -X POST "https://api.contentful.com/spaces/<SPACE_ID>/webhook_definitions" \
  -d '{"url": "https://api.netlify.com/build_hooks/<HOOK_ID>", "name": "Netlify - Deploy a site", "topics": ["Entry.publish", "Asset.publish", "Entry.unpublish", "Asset.unpublish"], "filters": [{"equals":[{"doc":"sys.environment.sys.id"},"master"]}]}' \
  -H 'Authorization: Bearer <API_KEY>' \
  -H 'Content-Type: application/vnd.contentful.management.v1+json'
```

> For the CLI: Check what’s the best way to access the <HOOK_ID> from Netlify 



## Netlify

## Emails

## Admin panel

## Gatsby-Theme

### gatsby-theme documentation notes

> * Explain shadowing and mention that you have to rebuild the dev bundle, if you added a new file that you want to be shadowed
> * Link to https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/ and briefly explain how to import and extend shadowed files
> * Show hot to change paddings and margins
> * Describe how the css-color-variables work in relation to the section colors, modals and buttons and show which files would have to be modified to change that
> * Explain shadowing for the Logo and how different file formats and file names are accepted, it will just take the first image (.png, .jpg, .svg) in src/gatsby-theme-xbge/assets/logo

#### Shadowing example:

The variables in `gatsby-theme-xbge/src/style/vars_default.less` can be overwritten in `your-site/src/gatsby-theme-xbge/style/vars_config.less`. (Technically this is split up in two files, so you pick the variables you want to overwrite and use the default values for the rest)

``` less
@sectionColor1: #fef377;        // @yellow
@sectionColor2: #fc484c;        // @red
@textOnSectionColor2: #f5f5f5;  // @greyBright
@sectionColor3: #f0f0f0;        // @grey
@accentColor1: #22c8ee;         // @blueBright
@accentColor2: #3423f6;         // @blueDark
@accentColor3: #e5b5c8;         // @rose
@accentColor4: #7d69f6;         // @pink
@menuBackgroundColor: white;    // @white
@strokeOnIcons: #1D1D1B;        // @black
````






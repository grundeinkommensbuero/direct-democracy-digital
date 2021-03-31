# Direct Democracy Digital :loudspeaker::pencil: 

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

### Installation
`npm install -g direct-democracy-digital`

### Setup
`direct-democracy-digital setup`

Just follow the instructions of the cli. Some of the steps (such as installing dependencies) might take a few minutes. You will be asked to login into your Contentful account during one of steps. 

After the setup you can configure the application even further before deploying. For instance you can edit the content (see Contentful), customize the design (see Gatsby Theme) and change the content of the emails (see Emails). After deploying for the first time you can always change stuff later and deploy again. So if you are curious to see what the dummy site looks like, you can go ahead and deploy first. The dummy site will also contain instructions on where to change the content it displays. The dummy site is the same as our [live demo](https://direkte-demokratie.netlify.app/) (also see Annotated Example).

### Deployment
`direct-democracy-digital deploy`

Follow the instructions to deploy the application to your Netlify account. You will be prompted for your AWS credentials (see Get credentials) and logged into your Netlify account.

First the backend infrastructure will be deployed to AWS. Afterwards the frontend application and admin panel will be deployed to Netlify. They will already be automatically connected to the backend.

You will also be asked for the sender email address for the transactional mail. Simply type in the email you configured with SES. 

The whole deployment process might take a few minutes. 

## AWS

Out of the box there will be no need to customize anything in the context of our AWS dependencies (DynamoDB, Cognito etc), but in case you want to look at or edit the saved data, you can simply sign  into the [AWS console](https://aws.amazon.com/de/console/) and go to one of the services. 

## Contentful

We use Contentful as a CMS for the website. You can [change the content](https://www.contentful.com/help/entry-editor/) of individual pages, [add new ones](https://www.contentful.com/help/contentful-101/#step-6-add-content) and change the navigation and footer menu on the site.

> Note: Contentful is structured by two main concepts: _Content model_ and _Content_. The content models are scaffolds or blue prints for  content you can add and determine your edit options and the names of different fields. Since we already set up the content models for the site you only need to interact with the _Content_ section of the Contentful webapp where you will find the _Content Types_ and field names we will refer to in the next sections. 

> Advanced users can of course adjust the content model, but have to adjust the code of the Gatsby Theme, too.

### Main structure

The main entry point to customize the site is the Content Type **Global Stuff**. This is the only content type where it won’t make sense to create an additional entry with that type. You should just edit the existing one. 

Global stuff also allows you to navigate to all parts of the website. The fields in global stuff allow you to set the main meta tags for the site, the top menu and the footer items. 

Individual Pages on the site can be created with the content type **Static Content**. For the _Main Menu_ you can either reference Static Content pages directly, or you can use the content type **Menu Oberpunkt** to create a list of pages that you can reference in the field _Unterpunkte_ (Unterpunkte can have an external or internal link, if they are not set, nothing happens, if you click on the menu parent)

In our setup Static Content pages consist of **Page Sections**. There are several Page Section Content type which share the main behavior of setting a new full-width container on the page with a new background color. 

The most versatile content type is the **Page Section** without any suffixes. It gives you the option to set two text blocks (one in the beginning: _Text am Anfang_, one at the end: _Text am Ende_). In between you can have elements like a call to action button and you can set up the _Team Member_ and the bar charts visualizing your initiative’s progress with _Visualisierungen_. 

> Note: After the last text block you can also add maps of an area where you to show specific spots (our intented use case were places where signatures are collected). With the _Config_ field you can set wich area will be shown in the map. Since this is still tightly coupled to our use case, you have to adapt it a bit for your use case: You can select a _State_ on the map, which you’ll also have to select on the **Sammelort** content type which is a single point on the map. The _State_ fields are just for selecting points for the map and have no other functionality and are not displayed on the site, so you can use the five states available and map them to your use cases.

#### Annotated example

To see the contentful edits in action you can check out our [live demo](https://direkte-demokratie.netlify.app/). All the content featured in the demo will also be available in your initial setup, so you can compare the entries with the result. There’s also more hints included in the description there, unfortunately these are only available in German at the time of writing this documentation. 


## Gatsby Theme

We use Gatsby as a React framework for the platform’s website. Gatsby provides the option to create reusable scaffolds that can be used in multiple projects via Gatsby Themes. Running our general setup script `direct-democracy-digital setup` will create a Gatsby project in the `site` folder with our Gatsby Theme pre-installed.

### Customization

To provide you with extended options to customize our theme according to your needs, we use [Gatsby’s Shadowing concept](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing). **Shadowing** allows you to [extend](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#extending-shadowed-files) and [replace](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/shadowing/#shadowing-other-files) any file located in the **`/src` folder** in [our Gatsby Theme repo](https://github.com/grundeinkommensbuero/gatsby-theme/tree/master/gatsby-theme-direct-democracy/sr) with your own implementation. 

To customize the CSS we provide a set of `_config.less` files. Any variables you provide with new values in these files will be overwritten, otherwise the default value will be used.

#### Basic css and fonts

In the same fashion you can change the [basic CSS setup](https://github.com/grundeinkommensbuero/gatsby-theme/blob/master/gatsby-theme-direct-democracy/src/style/base_default.less) in the `site/src/gatsby-theme-direct-democracy/base_config.less` file. If you want to use your own custom font, you can do a @font-face import in `site/src/gatsby-theme-direct-democracy/webfont_config.less`. 

#### Styles and colors

To change the color scheme and some style variables you can add the variables in  `site/src/gatsby-theme-direct-democracy/vars_config.less`. You can see [all available variables and default values here](https://github.com/grundeinkommensbuero/gatsby-theme/blob/master/gatsby-theme-direct-democracy/src/style/vars_default.less). 

> Regarding the color variables it’s important to note that the naming is based on our system of alternating colors for subsequent sections. In this alternative example the first section on a page will have a yellow background, the second will be red and the third will be grey and then the pattern repeats. The font color of text in the second section can be configured separately for the other sections another section color will be used. It’s best to test your color scheme on the development site to understand how this system works. 

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
```

#### Custom Logo

To provide your own logo is even easier: You can add your own logo by storing it in `site/src/gatsby-theme-direct-democracy/assets/logo`. The logo can be stored as PNG, JPEG or SVG.

## Netlify

As already mentioned we use Netlify to host the frontend application and admin panel. Unfortunately our deployment scripts do not let you create a new domain or automatically link the application to your existing domain. 

You can add or create a custom domain in the domain settings of your newly created site in your netlify account. You can either create a new domain. In this case Netlify automatically configures DNS settings and a certificate for you. Or you can link the site to an already existing domain. In that case you can follow the instructions of the [netlify docs](https://docs.netlify.com/domains-https/custom-domains/?_ga=2.125223562.1608661998.1617182051-227056302.1572609270). 

## Emails

For our automatic mails we use [mjml](https://mjml.io/) to define what the mail should look like. The mjml templates will be automatically rendered to html while our deploy scripts run. 

If you want to change the color scheme of the emails you can adjust the colors inside /mails/includes/head.mjml. 

The content can also be changed by simply editing the mjml files inside /mails. In some mails you definitely need to edit some text (e.g. your address in signatureListMail). 

## Signature List

To use your signature list instead of the dummy signature list, you simply need to replace the atuomatically created pdf (or pdfs, if you defined multiple campaigns) inside the backend/lists folder. The naming has to stay the same. For the barcode to be placed at the correct spot of the pdf you need to create a list which leaves an empty area at the predefined spot. You can just use [this jpeg template](https://images.ctfassets.net/af08tobnb0cl/6j1TFBBXnLRdbpacGoAX0j/f4f3fff5759b17ca37b5cb7e104baa77/Vorlage-barcode.jpg) as a background for your signature list. This way you make sure that barcode will be placed correctly later on. 

Depending on where your campaign is active the requirements for the list might be different, but just take a look at our [dummy pdf](https://assets.ctfassets.net/af08tobnb0cl/3uyOjTujYuJLcGhjPUqT5R/f0a3e70cec240c0fcb66e7e8b6ec561b/Unterschriften-dummy.pdf) to see what it might look like. 

## Admin panel

The admin panel gives an overview over several statistics (e.g. how many signatures were already collected). It also offers the possibility to enter newly arrived signatures or look up data of a specific user. 

The admin panel is basically ready out of the box since there is not really a need to customize the styling. The only thing that is really necessary is creating admin users, so you can sign into the admin panel. You simply have to go to AWS console, open the Cognito service, choose the admin pool and create a new user under "Users and groups". You only have to fill in the field "Email" and "Username" with the email you want to add. You don't have to set a password or send an invitation. The newly created user can now simply sign in via the same login code mechanism the frontend application uses. 

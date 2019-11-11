# ![RealWorld Google Apps Script Example App using gs](image.jpg) **RealWorld** example app (WIP)

## Description

- based off of the [apps-script-starter](https://github.com/labnol/apps-script-starter)
- [RealWorld Issue 434](https://github.com/gothinkster/realworld/issues/434)
- will follow the [spec](https://github.com/gothinkster/realworld/tree/master/api) using GET and POST with a cors proxy

### Getting Started

- `npm install` install dependencies
- `npx clasp login` Log in to Google clasp and authorize with your Google account. Open the link and authorize.

- Setup database and deploy location (options)
  1. `npx clasp create --type sheets --title "RealWorld Apps Script Project" --rootDir ./dist` Create a new Google Script bound to a Google Sheet (or set the type as standalone to create a standalone script in your Google Drive). Follow prompts in cmd to setup. May need to run this 2x and delete first document created after following the prompts.
    - Linked scripts file will be located in **.clasp.json**
  1. Copy [template](https://docs.google.com/spreadsheets/d/10e_ys79KtAp84wu8gJuWrAqxxaU8ebzC49YXIHjfl38/edit?usp=sharing)
    - Tools > Script Editor > copy the script id into from the url **.claps.json**

## Deploy

- `npm run deploy`
- `npm run deploy:prod` Deploy the project (production mode)

## Proxy

- see [ref](https://github.com/softius/php-cross-domain-proxy/blob/master/proxy.php)
  - proxy allows cors issues to be resolved while in browser
  - also DELETE and PUT requests will be forced to POST requests
- run simple server
  - `cd proxy`
  - `php -S localhost:8000`
  - open `http://localhost:8000/`

### Development vs Production mode

In the production mode, the function names and variable names are shrinked and the output code is auto-minifed. The production mode is not recommended for testing and debugging the Apps Script code.

### The .claspignore file

The `.claspignore` file allows you to specify file and directories that you do not wish to not upload to your Google Apps Script project via `clasp push`.

The default `.claspignore` file of the Apps Script Starter kit will push all the JS and HTML inside the `rootDir` folder and ignore all the other files.

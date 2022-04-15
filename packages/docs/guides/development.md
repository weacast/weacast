# Weacast development

Weacast is powered by the following stack:
* [Feathers](https://feathersjs.com/) on the backend side (version 2.x)
* [Quasar](http://quasar-framework.org/) on the frontend side (version 0.13.x)

If you are not familiar with those technologies and want to develop for Weacast, in addition to read the dedicated documentation, I recommand reading https://github.com/claustres/quasar-feathers-tutorial. Indeed, Weacast application demo is a template web application initially based on the [Quasar wrapper for Feathers](https://github.com/quasarframework/quasar-wrapper-feathersjs-api), while Weacast plugins/modules are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html). 

## Setup your environment

### Prerequisites

#### Install Node.js

[Node](https://nodejs.org/en/) is a server platform which runs JavaScript.
It's lightweight and efficient.
It has the largest ecosystem of open source libraries in the world.

- [Default install.](https://nodejs.org/en/)
- [Specific versions.](https://nodejs.org/en/download/)

::: tip
In order to be able to switch easily between different versions of Node.js we recommand to use a version manager like [n](https://github.com/tj/n)/[nvm](https://github.com/creationix/nvm) under Linux/Mac or [nvm](https://github.com/coreybutler/nvm-windows) under Windows.
:::

::: warning
Weacast modules are expected to work with Node.js version 7.x
:::

#### Install Git

[git](https://git-scm.com/) is the version control system most frequently used in open source.
There are many resources available for installing it.

- [Linux.](https://www.atlassian.com/git/tutorials/install-git#linux)
- [macOS.](https://www.atlassian.com/git/tutorials/install-git#mac-os-x)
- [Windows.](https://www.atlassian.com/git/tutorials/install-git#windows)

#### Install MongoDB

[Mongo](https://www.mongodb.com/) is an open-source, document database designed for ease of development and scaling.

- [Linux.](https://docs.mongodb.com/manual/administration/install-on-linux/)
- [macOS.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
- [Windows.](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

::: warning
Weacast modules are expected to work with MongoDB version 3.x
:::

#### Install Yarn

Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.

[Install Yarn](https://yarnpkg.com/en/docs/install) on your platform.

### Weacast

While it is a WIP and not yet pushed to NPM, or when developing, please use the following process.

First clone all the plugins you need and use [yarn/npm link](https://docs.npmjs.com/cli/link) to make them globally available to your Node.js installation.

::: danger
Take care that a top-level plugin might depend on another plugin so you will have to link them together, for instance most forecast model plugins depend on the `weacast-core` plugin.
:::

```bash
// Clone and link the plugins
git clone https://github.com/weacast/weacast-core.git
cd weacast-core
yarn install
yarn link

git clone https://github.com/weacast/weacast-client.git
cd weacast-client
yarn install
yarn link

git clone https://github.com/weacast/weacast-arpege.git
cd weacast-arpege
yarn install
yarn link weacast-core
yarn link

git clone https://github.com/weacast/weacast-arome.git
cd weacast-arome
yarn install
yarn link weacast-core
yarn link weacast-arpege
yarn link

git clone https://github.com/weacast/weacast-probe.git
cd weacast-probe
yarn install
yarn link weacast-core
yarn link

...
```

Then clone the Weacast API repository and use [yarn/npm link](https://docs.npmjs.com/cli/link) to make Node.js pointing to the previously cloned modules instead of those installed by default, e.g. :
```bash
// Clone and link plugins to weacast server
git clone https://github.com/weacast/weacast-api.git
cd weacast-api
yarn install
yarn link weacast-core
yarn link weacast-arpege
yarn link weacast-arome
yarn link weacast-probe
...
```

Then clone the Weacast demo app repository and use [yarn/npm link](https://docs.npmjs.com/cli/link) to make Node.js pointing to the previously cloned client module instead of the one installed by npm, e.g. :
```bash
// Clone and link client to weacast app
git clone https://github.com/weacast/weacast.git
cd weacast
yarn install
yarn link weacast-client
```

## Develop

### Weacast

#### Running for development

Run the the server-side Feathers app (from `weacast-api` root project folder): `$ npm run dev`

Then run the frontend app (from `weacast` root project folder): `$ npm run dev`

Then point your browser to [localhost:8080](http://localhost:8080).

#### Building for production

Build the server-side Feathers app (from `weacast-api` root project folder): `$ npm run compile`

Then build the frontend app (from `weacast` root project folder): `$ npm run build`.

This generates a `dist` folder **to be copied into** the `weacast-api` root project folder.

#### Running in production

::: tip
Make sure you built your app first
:::

Run the server-side Feathers app (from `weacast-api` root project folder), this will also serve the frontend app : `$ npm run prod`

Then point your browser to [localhost:8081](http://localhost:8081).

#### Running test

Run the server-side tests (from `weacast-api` root project folder): `$ npm run test`
This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [Istanbul](https://istanbul.js.org/).

::: tip
We are looking for integrating frontend and end-to-end tests, please contribute !
:::

#### Debug

Use [Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27).

#### Testing Docker image

Because Weacast web app is also released as a Docker image you can build it like this in development mode (i.e. with all modules linked to their `master` branch version):

```bash
docker build -f dockerfile.dev -t weacast/weacast:dev .
```
Then test it like it:

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

Then release it if you'd like as current dev version to share progress with others:

```bash
docker login
docker push weacast/weacast:dev
```

::: tip
When building the image all modules are retrieved from their respective repository (`master` branch), only the local source code of the web app is pushed into the image.

This requires you to have a DockerHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us
:::

### Plugins

Weacast plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. Typically for development you will do the following for each required plugins so that the module is re-compiled on each file change:

```bash
cd weacast-arpege
yarn/npm install
npm run watch
```

#### Running test

To run the module tests including linting and coverage : `$ npm run test`

To speed-up things simply run the tests with: `$ npm run mocha`

To speed-up things even more run a single test suite with: `$ npm run mocha -- --grep "test suite name"`

## Publish

### Prerequisites

#### Install Change log generator

This [gem](https://github.com/skywinder/github-changelog-generator) generates a change log file based on **tags**, **issues** and merged **pull requests** (and splits them into separate lists according to labels) from :octocat: GitHub Issue Tracker. This requires you to install (e.g. for Windows) [Ruby](http://rubyinstaller.org/downloads/) and its [DevKit](https://github.com/oneclick/rubyinstaller/wiki/Development-Kit).

### Weacast

The same process applies when releasing a patch, minor or major version, i.e. the following tasks are done:
* increase the package version number in the **package.json** file (frontend and backend API)
* create a tag accordingly in the git repository and push it
* generates the changelog in the git repository and push it

::: warning
Before you publish a release take care of updating the version of all dependent plugins to the latest version published, for example  perform `yarn upgrade weacast-core weacast-arpege weacast-arome weacast-probe`
:::

Depending on the release type the following command will do the job (where type is either `patch`, `minor`, `major`):
```bash
npm run release:type
```

Because Weacast demo app is also released as a Docker image you can build it manually like this:
```bash
docker build -t weacast/weacast .
```
Then release it as latest version:
```bash
docker login
docker push weacast/weacast
```
And tag it (`version_tag` being the current version number like `1.1.2`)
```bash
docker tag weacast/weacast weacast/weacast:version_tag
docker push weacast/weacast:version_tag
```

::: tip
This requires you to have a DockerHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us
:::

**However, our Travis CI should build he image for you as you push the tag of the release**

When testing in development you can build a Docker image that will automatically use the master branch of all modules like this:
```bash
docker build -t weacast/weacast:dev -f dockerfile.dev .
```
Then release it as latest dev version:
```bash
docker login
docker push weacast/weacast:dev
```

### Plugins

The same process applies as for the web app but in addition the module is published on the NPM registry.

::: tip
This requires you to have a NPM and GitHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us.
:::

::: warning
Before you publish a plugin take care of updating the version of your dependent plugins to the latest version published, for example  perform `yarn upgrade weacast-core` for a plugin depending on the core plugin before publishing it.
:::



# Weacast development

Weacast API is mainly powered by [Feathers](https://feathersjs.com/) (version 5.x).
Weacast demo app is mainly powered by [Quasar](http://quasar-framework.org/) on the frontend side (version 0.13.x).

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
At the time of writing Weacast modules v2.x (`master` branch) are expected to work with Node.js 16.x and Weacast modules v1.x are expected to work with Node.js 12.x
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
At the time of writing the Weacast modules v2.x (`master` branch) are expected to work with MongoDB 4.x and Weacast modules v1.x are expected to work with MongoDB 3.x
:::

#### Install Yarn

Due to some [changes](http://codetunnel.io/npm-5-changes-to-npm-link/) in the way `npm` manages linked modules we prefer to use [Yarn](https://yarnpkg.com) as a package manager.

[Install Yarn](https://yarnpkg.com/en/docs/install) on your platform.

### Weacast

While it is a WIP and not yet pushed to NPM, or when developing, please use the following process.

First clone and install the Weacast monoreo, [lerna](https://lerna.js.org/) will [link](https://docs.npmjs.com/cli/link) all modules together:
```bash
// Clone and link the modules
git clone https://github.com/weacast/weacast.git
cd weacast
yarn install
...
```

Then clone and install the Weacast demo app repository:
```bash
// Clone and link client to weacast app
git clone https://github.com/weacast/weacast.git
cd weacast-app
yarn install
```

## Develop

### Weacast

#### Running for development

Run the server-side app (from `weacast/packages/api` project folder): `$ npm run dev`

Then run the frontend app (from `weacast-app` root project folder): `$ npm run dev`

Then point your browser to [localhost:8080](http://localhost:8080).

#### Building for production

Build the server-side app (from `weacast/packages/api` project folder): `$ npm run compile`

Then build the frontend app (from `weacast-app` root project folder): `$ npm run build`.

This generates a `dist` folder **to be copied into** the `weacast/packages/api` root project folder.

#### Running in production

::: tip
Make sure you built your app first
:::

Run the server-side app (from `weacast/packages/api` root project folder), this will also serve the frontend app : `$ npm run prod`

Then point your browser to [localhost:8081](http://localhost:8081).

#### Running test

Run the server-side tests (from `weacast` root project folder): `$ npm run test`
This will lint and fix issues in the code according to [JS standard](https://github.com/feross/standard), then execute tests using [Mocha](https://mochajs.org/) and compute code coverage using [c8](https://github.com/bcoe/c8).

#### Debug

Use [Chrome DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27).

#### Testing Docker images

Because Weacast API and demo application are also released as Docker images, you can build it manually like this in development mode (i.e. with all modules linked to their `master` branch version):

```bash
// API
cd packages/api
docker build -f dockerfile.dev -t weacast/weacast-api:dev .
// Demo application
cd weacast-app
docker build -f dockerfile.dev -t weacast/weacast:dev .
```

::: tip
The demo application image depends on the weacast API image so that the build order is important.
:::

Then test it like this:
```
// API
cd packages/api
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
// Demo application
cd weacast-app
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

You can release it manually if you'd like as current dev version to share progress with others:
```bash
docker login
docker push weacast/weacast:dev
```

**However, our Travis CI should build the development images for you as you commit**

::: tip
When building the image all modules are retrieved from their respective repository (`master` branch), only the local source code of the demo web app is pushed into the image.

This requires you to have a DockerHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us
:::

### Plugins

Weacast plugins are [Feathers plugins](https://docs.feathersjs.com/guides/advanced/creating-a-plugin.html), so you will find most of the required information in the linked Feathers documentation. 

#### Running tests

To run the module tests including linting and coverage : `$ npm run test`

To speed-up things simply run the tests with: `$ npm run mocha`

To speed-up things even more run a single test suite with: `$ npm run mocha -- --grep "test suite name"`

## Publish

### Modules and plugins

We rely on [Lerna](https://lerna.js.org/) to handle the publishing process, including version number update, changelog generation based on conventional commits, etc. It should take care of updating the version of all dependent plugins to the latest version published. Use the following command:
```bash
// Your GitHub authentication token
export GH_TOKEN=xxx
yarn run publish
```

::: tip
This requires you to have a NPM and GitHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us.
:::

### Docker images

Because Weacast API and demo application are also released as Docker images, you can build it manually like this in release mode (i.e. with all modules linked to their latest version):

```bash
// API
cd packages/api
docker build -t weacast/weacast-api .
// Demo application
cd weacast-app
docker build -t weacast/weacast .
```

::: tip
The demo application image depends on the weacast API image so that the build order is important.
:::

Then release it as latest version:
```bash
docker login
docker push weacast/weacast-api
docker push weacast/weacast
```
And tag it (`version_tag` being the current version number like `1.1.2`)
```bash
docker tag weacast/weacast-api weacast/weacast-api:version_tag
docker push weacast/weacast-api:version_tag
docker tag weacast/weacast weacast/weacast:version_tag
docker push weacast/weacast:version_tag
```

::: tip
This requires you to have a DockerHub account and be a team member of the Weacast organization, if you'd like to become a maintainer please tell us
:::

**However, our Travis CI should build the images for you as you push the tag of the release**

# Weacast

[![Latest Release](https://img.shields.io/github/v/tag/weacast/weacast?sort=semver&label=latest)](https://github.com/weacast/weacast/releases)
[![Build Status](https://github.com/weacast/weacast/actions/workflows/main.yaml/badge.svg)](https://github.com/weacast/weacast/actions/workflows/main.yaml)
[![Maintainability Issues](https://sonar.portal.kalisio.com/api/project_badges/measure?project=kalisio-weacast&metric=software_quality_maintainability_issues&token=sqb_85e62a60b77ed3349b33366a595c8386063f28b8)](https://sonar.portal.kalisio.com/dashboard?id=kalisio-weacast)
[![Coverage](https://sonar.portal.kalisio.com/api/project_badges/measure?project=kalisio-weacast&metric=coverage&token=sqb_85e62a60b77ed3349b33366a595c8386063f28b8)](https://sonar.portal.kalisio.com/dashboard?id=kalisio-weacast)
[![Documentation](https://img.shields.io/badge/documentation-available-brightgreen.svg)](https://weacast.github.io/weacast/)
[![Docker Pulls](https://img.shields.io/docker/pulls/weacast/weacast-api.svg)](https://hub.docker.com/r/weacast/weacast-api/)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fweacast%2Fweacast.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fweacast%2Fweacast?ref=badge_shield)

This is the Weacast monorepo with all packages that are published under the `@weacast` npm organization, they were previously provided as stand-alone repositories and packages under the `weacast-xxx` naming.

> It was previously the repository of the weacast demo application you can now find here: https://github.com/weacast/weacast-app.

To get started, clone the repository and run:
```
yarn install
yarn test
```

## Packages

The following packages are available:
* [@weacast/core](./packages/core): toolkit to support Weacast applications and plugins
* [@weacast/gfs](./packages/gfs): GFS weather forecast model plugin for Weacast
* [@weacast/arpege](./packages/arpege): ARPEGE weather forecast model plugin for Weacast
* [@weacast/arome](./packages/arome): AROME weather forecast model plugin for Weacast
* [@weacast/probe](./packages/probe): probing forecast model plugin for Weacast
* [@weacast/alert](./packages/alert): alerting plugin for Weacast
* [@weacast/api](./packages/api): microservice web app to expose weather forecast data
* [@weacast/leaflet](./packages/leaflet): Leaflet plugin to visualize Weacast forecast layers
* [@weacast/grib2json](./packages/grib2json): CLI to converts GRIB2 files to JSON
* [@weacast/gtiff2json](./packages/gtiff2json): CLI to convert GeoTiff files to JSON

## Documentation

The [Weacast docs](https://weacast.github.io/weacast/) are loaded with awesome stuff and tell you everything you need to know about using and configuring Weacast.

## License

This project is licensed under the MIT License - see the [license file](./LICENSE) for details

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fweacast%2Fweacast.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fweacast%2Fweacast?ref=badge_large)

The detailed list of Open Source dependencies can be found in our [3rd-party software report](https://app.fossa.com/projects/git%2Bgithub.com%2Fweacast%2Fweacast?utm_source=share_link).


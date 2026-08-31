# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.3.3](https://github.com/weacast/weacast/compare/v2.3.2...v2.3.3) (2026-08-31)


### Bug Fixes

* ARPEGE world 0.25° model data are shifted by 180° (closes [#85](https://github.com/weacast/weacast/issues/85)) ([23e798e](https://github.com/weacast/weacast/commit/23e798eb70553c6aaeb345e6ae9d7202b603160c))
* Removed test server key/cert ([31bf516](https://github.com/weacast/weacast/commit/31bf516ead94a30a408f45ce0ff5bf40ad37a75f))


### Reverts

* Revert "chore(release): publish v2.3.3" ([891f88d](https://github.com/weacast/weacast/commit/891f88da679b70f77388cb764d4cb4054585acd3))
* Revert "chore(release): publish v2.3.3" ([f9683d0](https://github.com/weacast/weacast/commit/f9683d0ab2a30064c9911470c79019f11891f3b2))
* Revert "chore(release): publish v2.3.3" ([45efd94](https://github.com/weacast/weacast/commit/45efd94dab147977e4289a8bc9284c889ce8ef34))
* Revert "chore(release): publish v2.3.4" ([96d7e92](https://github.com/weacast/weacast/commit/96d7e92ab3c894b2b418b3a0ec4c381271fa5e28))





## [2.3.2](https://github.com/weacast/weacast/compare/v2.3.1...v2.3.2) (2026-01-23)


### Bug Fixes

* override config package version. ([311331c](https://github.com/weacast/weacast/commit/311331c094fe452e142a90216f61da1c3bf34ed4))





## [2.3.1](https://github.com/weacast/weacast/compare/v2.3.0...v2.3.1) (2026-01-23)


### Bug Fixes

* improve code sources and coverage for SonarQube ([5785b6a](https://github.com/weacast/weacast/commit/5785b6ad59e09aff1da59473edbf408ad19e9d31))





# [2.3.0](https://github.com/weacast/weacast/compare/v2.2.2...v2.3.0) (2025-10-10)


### Bug Fixes

* Make healthcheck aware of database connection errors (closes [#81](https://github.com/weacast/weacast/issues/81)) ([32e5f11](https://github.com/weacast/weacast/commit/32e5f11ca08d087cfbf472628a7dffca4eca61d3))





## [2.2.2](https://github.com/weacast/weacast/compare/v2.2.1...v2.2.2) (2024-09-06)


### Bug Fixes

* OAuth callback service is distributed while authentication related services should not (closes [#78](https://github.com/weacast/weacast/issues/78)) ([e784362](https://github.com/weacast/weacast/commit/e784362a638ededc5fff2b3ed4d3a12aeab163e1))





## [2.2.1](https://github.com/weacast/weacast/compare/v2.2.0...v2.2.1) (2024-09-06)


### Bug Fixes

* OAuth callback service is distributed while authentication related services should not (closes [#78](https://github.com/weacast/weacast/issues/78)) ([89a7b40](https://github.com/weacast/weacast/commit/89a7b40b4f75a61eb5442b6b568c468bca37a486))





# [2.2.0](https://github.com/weacast/weacast/compare/v2.1.7...v2.2.0) (2024-09-03)


### Features

* Upgrade NodeJS to v20 and MongoDB to v7 ([#76](https://github.com/weacast/weacast/issues/76)/[#77](https://github.com/weacast/weacast/issues/77)) [additional tests] ([8990de1](https://github.com/weacast/weacast/commit/8990de121b06f0d01b3299f92168f458330993f6))





## [2.1.7](https://github.com/weacast/weacast/compare/v2.1.6...v2.1.7) (2024-04-16)

**Note:** Version bump only for package @weacast/api





## [2.1.6](https://github.com/weacast/weacast/compare/v2.1.5...v2.1.6) (2023-05-30)

**Note:** Version bump only for package @weacast/api





## [2.1.5](https://github.com/weacast/weacast/compare/v2.1.4...v2.1.5) (2023-05-23)

**Note:** Version bump only for package @weacast/api





## [2.1.4](https://github.com/weacast/weacast/compare/v2.1.3...v2.1.4) (2022-10-19)

**Note:** Version bump only for package @weacast/api





## [2.1.3](https://github.com/weacast/weacast/compare/v2.1.2...v2.1.3) (2022-06-20)

**Note:** Version bump only for package @weacast/api





## [2.1.2](https://github.com/weacast/weacast/compare/v2.1.1...v2.1.2) (2022-06-17)

**Note:** Version bump only for package @weacast/api






## [2.1.1](https://github.com/weacast/weacast/compare/v2.1.0...v2.1.1) (2022-06-17)

**Note:** Version bump only for package @weacast/api

# [2.1.0](https://github.com/weacast/weacast/compare/v2.0.3...v2.1.0) (2022-06-17)

### Features

* Upgrade NodeJS to v16 - latest fixes (closes [#2](https://github.com/weacast/weacast/issues/2)) ([2071454](https://github.com/weacast/weacast/commit/2071454415249f33ad16be37f5672606633250db))

## [v1.3.0](https://github.com/weacast/weacast-api/tree/v1.3.0) (2020-09-21)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.2.1...v1.3.0)

## [v1.2.1](https://github.com/weacast/weacast-api/tree/v1.2.1) (2020-05-15)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.2.0...v1.2.1)

**Fixed bugs:**

- Missing curl to perform Docker healthcheck [\#20](https://github.com/weacast/weacast-api/issues/20)

## [v1.2.0](https://github.com/weacast/weacast-api/tree/v1.2.0) (2020-05-13)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.1.1...v1.2.0)

## [v1.1.1](https://github.com/weacast/weacast-api/tree/v1.1.1) (2020-01-15)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.1.0...v1.1.1)

**Fixed bugs:**

- Production container does not start [\#18](https://github.com/weacast/weacast-api/issues/18)

## [v1.1.0](https://github.com/weacast/weacast-api/tree/v1.1.0) (2019-12-30)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.0.1...v1.1.0)

**Implemented enhancements:**

- Make default configuration minimalist [\#16](https://github.com/weacast/weacast-api/issues/16)
- Enhance docker build to decrease image size [\#13](https://github.com/weacast/weacast-api/issues/13)
- Add a healthcheck endpoint [\#5](https://github.com/weacast/weacast-api/issues/5)
- Add temperature element to default configuration [\#4](https://github.com/weacast/weacast-api/issues/4)

**Merged pull requests:**

- Add license scan report and status [\#14](https://github.com/weacast/weacast-api/pull/14) ([fossabot](https://github.com/fossabot))

## [v1.0.1](https://github.com/weacast/weacast-api/tree/v1.0.1) (2019-06-14)

[Full Changelog](https://github.com/weacast/weacast-api/compare/v1.0.0...v1.0.1)

## [v1.0.0](https://github.com/weacast/weacast-api/tree/v1.0.0) (2019-06-14)

[Full Changelog](https://github.com/weacast/weacast-api/compare/df4f188610cfaa3644b9ac82920d5effa87ca0bf...v1.0.0)

**Implemented enhancements:**

- Add an entry point so that custom code can be included by overriding it [\#3](https://github.com/weacast/weacast-api/issues/3)
- Allow to filter which forecast/element to be probed [\#2](https://github.com/weacast/weacast-api/issues/2)
- Allow to disable user registration by configuration [\#1](https://github.com/weacast/weacast-api/issues/1)



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*

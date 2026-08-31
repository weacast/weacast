# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.3.3](https://github.com/weacast/weacast/compare/v2.3.2...v2.3.3) (2026-08-31)


### Bug Fixes

* ARPEGE world 0.25° model data are shifted by 180° (closes [#85](https://github.com/weacast/weacast/issues/85)) ([0837dee](https://github.com/weacast/weacast/commit/0837dee0ffb263368cc8e42ea47e0bb0fc16ec6f))
* ARPEGE world 0.25° model data are shifted by 180° (closes [#85](https://github.com/weacast/weacast/issues/85)) ([23e798e](https://github.com/weacast/weacast/commit/23e798eb70553c6aaeb345e6ae9d7202b603160c))
* Removed test server key/cert ([31bf516](https://github.com/weacast/weacast/commit/31bf516ead94a30a408f45ce0ff5bf40ad37a75f))


### Reverts

* Revert "chore(release): publish v2.3.3" ([26dca23](https://github.com/weacast/weacast/commit/26dca231851bbf4c670af09b4977ee80d11aab3c))
* Revert "chore(release): publish v2.3.3" ([891f88d](https://github.com/weacast/weacast/commit/891f88da679b70f77388cb764d4cb4054585acd3))
* Revert "chore(release): publish v2.3.3" ([f9683d0](https://github.com/weacast/weacast/commit/f9683d0ab2a30064c9911470c79019f11891f3b2))
* Revert "chore(release): publish v2.3.3" ([45efd94](https://github.com/weacast/weacast/commit/45efd94dab147977e4289a8bc9284c889ce8ef34))
* Revert "chore(release): publish v2.3.4" ([96d7e92](https://github.com/weacast/weacast/commit/96d7e92ab3c894b2b418b3a0ec4c381271fa5e28))





## [2.3.2](https://github.com/weacast/weacast/compare/v2.3.1...v2.3.2) (2026-01-23)


### Bug Fixes

* override config package version. ([311331c](https://github.com/weacast/weacast/commit/311331c094fe452e142a90216f61da1c3bf34ed4))





## [2.3.1](https://github.com/weacast/weacast/compare/v2.3.0...v2.3.1) (2026-01-23)


### Bug Fixes

* comment test to validate CI and implement SonarQube ([60725da](https://github.com/weacast/weacast/commit/60725dac5a5acaa09e24b32af93b876180c3cc1b))
* improve code sources and coverage for SonarQube ([5785b6a](https://github.com/weacast/weacast/commit/5785b6ad59e09aff1da59473edbf408ad19e9d31))
* probe name ([adfbd23](https://github.com/weacast/weacast/commit/adfbd235351068534807ec84eb3d6e18cfe6dd1f))
* restore commented tests ([9fbbb68](https://github.com/weacast/weacast/commit/9fbbb68eabb28e3d287dfc1e4fb04c1a3404358f))
* update init runner with sonnar ([e451d40](https://github.com/weacast/weacast/commit/e451d4014733b6413d2875c69cb71179e148237c))
* update kash ([fb0fb74](https://github.com/weacast/weacast/commit/fb0fb74f52d4bc1fc7b76df1745f0aa19350fa99))


### Features

* add Sonar badges ([36393b9](https://github.com/weacast/weacast/commit/36393b96e7ffc45bc4d10427d146d7017246d5a4))





# [2.3.0](https://github.com/weacast/weacast/compare/v2.2.2...v2.3.0) (2025-10-10)


### Bug Fixes

* Make healthcheck aware of database connection errors (closes [#81](https://github.com/weacast/weacast/issues/81)) ([32e5f11](https://github.com/weacast/weacast/commit/32e5f11ca08d087cfbf472628a7dffca4eca61d3))
* removed code climate reporting to make tests run ([8fb0a51](https://github.com/weacast/weacast/commit/8fb0a51a31be581af9445e26a78a20e425b0ff8e))


### Features

* Move from query parameter to header for Météo France token (closes [#82](https://github.com/weacast/weacast/issues/82)) ([a50d6f3](https://github.com/weacast/weacast/commit/a50d6f35b8eac9d23e5cbb842d84f3dc696d5bea))


### Reverts

* Revert "chore: tried to fix CI" ([d815ccf](https://github.com/weacast/weacast/commit/d815ccf0177c7ab08e468982cdcf1f1f2423c073))





## [2.2.2](https://github.com/weacast/weacast/compare/v2.2.1...v2.2.2) (2024-09-06)


### Bug Fixes

* OAuth callback service is distributed while authentication related services should not (closes [#78](https://github.com/weacast/weacast/issues/78)) ([e784362](https://github.com/weacast/weacast/commit/e784362a638ededc5fff2b3ed4d3a12aeab163e1))





## [2.2.1](https://github.com/weacast/weacast/compare/v2.2.0...v2.2.1) (2024-09-06)


### Bug Fixes

* OAuth callback service is distributed while authentication related services should not (closes [#78](https://github.com/weacast/weacast/issues/78)) ([89a7b40](https://github.com/weacast/weacast/commit/89a7b40b4f75a61eb5442b6b568c468bca37a486))





# [2.2.0](https://github.com/weacast/weacast/compare/v2.1.7...v2.2.0) (2024-09-03)


### Bug Fixes

* ability to run CI workflow manually ([f5c4a90](https://github.com/weacast/weacast/commit/f5c4a905709fdf3d3b4e1edf14094caa75377542))


### Features

* Refactor CI to use GitHub actions and generic bash scripts - badge (closes [#75](https://github.com/weacast/weacast/issues/75)) ([b7584bc](https://github.com/weacast/weacast/commit/b7584bc7733a4472e6d463d8e185fcf29e4e2202))
* Refactor CI to use GitHub actions and generic bash scripts - use github pages organisation token ([#75](https://github.com/weacast/weacast/issues/75)) [build doc] ([5dfe1d9](https://github.com/weacast/weacast/commit/5dfe1d91c200e43b58970d52daaf087434bb66e7))
* Refactor CI to use GitHub actions and generic bash scripts - use github pages organisation token ([#75](https://github.com/weacast/weacast/issues/75)) [build doc] ([edd9e04](https://github.com/weacast/weacast/commit/edd9e04faa8689caaa3cff562adf2823fc5e5270))
* Replace or update mubsub (closes [#9](https://github.com/weacast/weacast/issues/9)) ([f2f3876](https://github.com/weacast/weacast/commit/f2f3876d1e13ae6ae52262867a6b7f959adff82c))
* Upgrade NodeJS to v20 and MongoDB to v7 ([#76](https://github.com/weacast/weacast/issues/76)/[#77](https://github.com/weacast/weacast/issues/77)) [additional tests] ([8990de1](https://github.com/weacast/weacast/commit/8990de121b06f0d01b3299f92168f458330993f6))





## [2.1.7](https://github.com/weacast/weacast/compare/v2.1.6...v2.1.7) (2024-04-16)


### Features

* migrate docs to vitepress (closes [#57](https://github.com/weacast/weacast/issues/57)) ([4d19828](https://github.com/weacast/weacast/commit/4d198283a4f19e5b9adffb362b22b50afff3b3f3))


### Reverts

* Revert "deps: updated geo-pixel-stream" ([39ca35d](https://github.com/weacast/weacast/commit/39ca35d33191c7f86a306a0abec19acf69236674))





## [2.1.6](https://github.com/weacast/weacast/compare/v2.1.5...v2.1.6) (2023-05-30)

**Note:** Version bump only for package weacast





## [2.1.5](https://github.com/weacast/weacast/compare/v2.1.4...v2.1.5) (2023-05-23)

**Note:** Version bump only for package weacast





## [2.1.4](https://github.com/weacast/weacast/compare/v2.1.3...v2.1.4) (2022-10-19)


### Bug Fixes

* API image not correctly tagged in the DockerHub (closes [#23](https://github.com/weacast/weacast/issues/23)) ([6010afc](https://github.com/weacast/weacast/commit/6010afcdf09ff3fd66a03c5ca70b6a21619047e4))





## [2.1.3](https://github.com/weacast/weacast/compare/v2.1.2...v2.1.3) (2022-06-20)

**Note:** Version bump only for package weacast





## [2.1.2](https://github.com/weacast/weacast/compare/v2.1.1...v2.1.2) (2022-06-17)

**Note:** Version bump only for package weacast





## [2.1.1](https://github.com/weacast/weacast/compare/v2.1.0...v2.1.1) (2022-06-17)

### Bug Fixes

* Missing dependency in gtiff2json package ([88ff187](https://github.com/weacast/weacast/commit/88ff1879cc0872c71d0fde6d4dd4b72504331aba))

# [2.1.0](https://github.com/weacast/weacast/compare/v2.0.3...v2.1.0) (2022-06-17)

### Features

* Update dependencies across modules (closes [#5](https://github.com/weacast/weacast/issues/5)) ([a637249](https://github.com/weacast/weacast/commit/a6372498954a246f2e1bfb2deecfcac4e3e70665))
* Upgrade Feathers to v5 (closes [#4](https://github.com/weacast/weacast/issues/4)) ([1ac00d1](https://github.com/weacast/weacast/commit/1ac00d10768f666cf86b684a32ea3bb55aec9232))
* Upgrade NodeJS to v16 - latest fixes (closes [#2](https://github.com/weacast/weacast/issues/2)) ([2071454](https://github.com/weacast/weacast/commit/2071454415249f33ad16be37f5672606633250db))
